import AdminSettings from '../AdminSettings';

export default function AdminSettingsExample() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminSettings
        onSave={(settings) => console.log('Settings saved:', settings)}
      />
    </div>
  );
}
