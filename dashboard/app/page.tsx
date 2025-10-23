export default function Dashboard() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>AI Centralinista Dashboard</h1>
      <p>Sistema pronto per configurazione!</p>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Prossimi passi:</h3>
        <ul>
          <li>Configurare numero Twilio</li>
          <li>Deploy backend su GCP</li>
          <li>Test chiamate</li>
        </ul>
      </div>
    </div>
  )
}
