import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * GET /api/dashboard/analytics
 * Calcola analytics reali dalle chiamate dell'utente
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    // Recupera tutte le chiamate completate dell'utente
    let callsSnapshot;
    try {
      callsSnapshot = await db
        .collection('calls')
        .where('status', '==', 'completed')
        .where('user_id', '==', session.user.email)
        .get();
    } catch (error) {
      // Fallback: recupera tutte e filtra
      const allCalls = await db
        .collection('calls')
        .where('status', '==', 'completed')
        .get();
      
      callsSnapshot = {
        docs: allCalls.docs.filter(doc => {
          const data = doc.data();
          return data.user_id === session.user.email || !data.user_id;
        })
      };
    }

    const calls = callsSnapshot.docs.map(doc => doc.data());
    
    // Calcola analytics
    let comprareCount = 0;
    let vendereCount = 0;
    const zonesMap = new Map<string, number>();
    const propertyTypesMap = new Map<string, number>();
    const featuresMap = new Map<string, number>();
    const budgets: number[] = [];
    let validLeads = 0;

    calls.forEach(call => {
      const clientInfo = call.client_info || {};
      const tipoRichiesta = (clientInfo.tipo_richiesta || '').toLowerCase();
      
      // Intent breakdown
      if (tipoRichiesta.includes('comprare') || tipoRichiesta.includes('acquistare')) {
        comprareCount++;
      } else if (tipoRichiesta.includes('vendere') || tipoRichiesta.includes('vendita')) {
        vendereCount++;
      }
      
      // Valid lead (ha almeno nome o telefono valido)
      if (clientInfo.nome && clientInfo.nome !== 'Non specificato') {
        validLeads++;
      }
      
      // Zones
      if (clientInfo.zona && clientInfo.zona !== 'Non specificato') {
        zonesMap.set(clientInfo.zona, (zonesMap.get(clientInfo.zona) || 0) + 1);
      }
      
      // Property types
      if (clientInfo.tipo_immobile && clientInfo.tipo_immobile !== 'Non specificato') {
        propertyTypesMap.set(
          clientInfo.tipo_immobile,
          (propertyTypesMap.get(clientInfo.tipo_immobile) || 0) + 1
        );
      }
      
      // Budget parsing
      if (clientInfo.budget && clientInfo.budget !== 'Non specificato') {
        const budgetStr = clientInfo.budget.replace(/[^\d]/g, '');
        const budgetNum = parseInt(budgetStr);
        if (!isNaN(budgetNum) && budgetNum > 0) {
          budgets.push(budgetNum);
        }
      }
      
      // Features from notes
      if (clientInfo.note && clientInfo.note !== 'Nessuna') {
        const noteLower = clientInfo.note.toLowerCase();
        const features = [
          'balcone', 'terrazzo', 'luminoso', 'sole', 'piano alto', 'ascensore',
          'garage', 'box', 'posto auto', 'cantina', 'ristrutturato', 'nuovo', 'arredato'
        ];
        
        features.forEach(feature => {
          if (noteLower.includes(feature)) {
            featuresMap.set(feature, (featuresMap.get(feature) || 0) + 1);
          }
        });
      }
    });

    const totalCalls = calls.length;
    const totalIntent = comprareCount + vendereCount;
    
    // Calculate percentages
    const intentBreakdown = {
      comprare: totalIntent > 0 ? Math.round((comprareCount / totalIntent) * 100) : 0,
      vendere: totalIntent > 0 ? Math.round((vendereCount / totalIntent) * 100) : 0,
    };
    
    // Top zones
    const topZones = Array.from(zonesMap.entries())
      .map(([zona, count]) => ({ zona, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Property types
    const totalProperties = Array.from(propertyTypesMap.values()).reduce((a, b) => a + b, 0);
    const propertyTypes = Array.from(propertyTypesMap.entries())
      .map(([tipo, count]) => ({
        tipo,
        percentage: totalProperties > 0 ? Math.round((count / totalProperties) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);
    
    // Top features
    const totalFeatures = Array.from(featuresMap.values()).reduce((a, b) => a + b, 0);
    const topFeatures = Array.from(featuresMap.entries())
      .map(([feature, count]) => ({
        feature: feature.charAt(0).toUpperCase() + feature.slice(1),
        percentage: totalFeatures > 0 ? Math.round((count / totalFeatures) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
    
    // Average budget
    const averageBudget = budgets.length > 0
      ? `€${Math.round(budgets.reduce((a, b) => a + b, 0) / budgets.length).toLocaleString('it-IT')}`
      : 'N/A';
    
    // Conversion rate
    const conversionRate = totalCalls > 0
      ? Math.round((validLeads / totalCalls) * 100)
      : 0;

    return NextResponse.json({
      intentBreakdown,
      topZones,
      propertyTypes,
      topFeatures,
      averageBudget,
      conversionRate,
      totalCalls,
      validLeads,
    });

  } catch (error: any) {
    console.error('Error calculating analytics:', error);
    return NextResponse.json(
      { error: 'Errore durante il calcolo delle analytics' },
      { status: 500 }
    );
  }
}

