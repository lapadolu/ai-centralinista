import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getOrder, updateVapiAssistantConfig, updateOrderStatus } from '@/lib/orders';
import { createVapiAssistant } from '@/lib/vapi';

/**
 * POST /api/admin/orders/[orderId]/create-assistant
 * Crea agent Vapi con configurazione
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verifica admin
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Non autorizzato - Accesso riservato agli admin' }, { status: 403 });
    }

    const { orderId } = await context.params;
    const order = await getOrder(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
    }

    const body = await request.json();
    const { vapi_config, structured_output } = body;

    if (!vapi_config || !vapi_config.prompt || !vapi_config.first_message) {
      return NextResponse.json(
        { error: 'Configurazione Vapi incompleta' },
        { status: 400 }
      );
    }

    // Crea assistant Vapi
    const webhookUrl = process.env.VAPI_WEBHOOK_URL || process.env.NEXT_PUBLIC_VAPI_WEBHOOK_URL;
    
    // Converti structured output fields in schema Vapi
    const structuredOutputs = structured_output?.fields ? [{
      name: 'lead_data',
      schema: {
        type: 'object' as const,
        properties: structured_output.fields.reduce((acc: any, field) => {
          let type = 'string';
          if (field.type === 'number') type = 'number';
          if (field.type === 'boolean') type = 'boolean';
          
          acc[field.name] = {
            type,
            description: field.label,
            ...(field.options && { enum: field.options }),
          };
          return acc;
        }, {}),
      },
    }] : [];

    const assistant = await createVapiAssistant({
      name: `${order.company_name} - ${order.industry}`,
      model: {
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: vapi_config.prompt,
          },
        ],
      },
      voice: {
        provider: '11labs',
        voiceId: vapi_config.voice || '21m00Tcm4TlvDq8ikWAM',
      },
      firstMessage: vapi_config.first_message,
      serverUrl: webhookUrl,
      endCallFunctionEnabled: vapi_config.end_call_function_enabled !== false,
      responseMode: (vapi_config.response_mode || order.response_mode || 'immediate') === 'immediate' ? 'immediate' : 'missed-call',
      structuredOutputs,
    });

    const vapiAssistantId = assistant.id;

    // Salva configurazione in order
    await updateVapiAssistantConfig(orderId, vapiAssistantId, {
      prompt: vapi_config.prompt,
      voice: vapi_config.voice || '21m00Tcm4TlvDq8ikWAM',
      first_message: vapi_config.first_message,
      end_call_function_enabled: vapi_config.end_call_function_enabled !== false,
      response_mode: vapi_config.response_mode || order.response_mode || 'immediate',
    });

    // Aggiorna status se era pending
    if (order.setup_status === 'pending_setup') {
      await updateOrderStatus(orderId, 'setup_in_progress', session.user.email);
    }

    // TODO: Implementare verifica agent creato
    // await verifyVapiAgent(vapiAssistantId);

    return NextResponse.json({
      success: true,
      assistant_id: vapiAssistantId,
      message: 'Agent Vapi creato con successo',
    });

  } catch (error: any) {
    console.error('Error creating Vapi assistant:', error);
    return NextResponse.json(
      { error: 'Errore durante la creazione dell\'agent Vapi' },
      { status: 500 }
    );
  }
}

