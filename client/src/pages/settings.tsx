import { useState } from 'react';
import PageHeader from '@/components/layout/page-header';

interface SystemSetting {
  id: string;
  category: string;
  label: string;
  description: string;
  value: string | boolean | number;
  type: 'text' | 'toggle' | 'select' | 'number';
  options?: string[];
}

const Settings = () => {
  const [activeCategory, setActiveCategory] = useState<string>('general');
  
  // Define system settings by category
  const [settings, setSettings] = useState<SystemSetting[]>([
    // General Settings
    {
      id: 'business_name',
      category: 'general',
      label: 'Business Name',
      description: 'The name of your business as it appears on receipts and reports',
      value: 'NightlifePro',
      type: 'text'
    },
    {
      id: 'address',
      category: 'general',
      label: 'Business Address',
      description: 'Your physical business address',
      value: '123 Nightclub St, City, State 12345',
      type: 'text'
    },
    {
      id: 'phone',
      category: 'general',
      label: 'Contact Phone',
      description: 'Primary contact phone number',
      value: '(555) 123-4567',
      type: 'text'
    },
    {
      id: 'email',
      category: 'general',
      label: 'Contact Email',
      description: 'Primary contact email',
      value: 'contact@nightlifepro.com',
      type: 'text'
    },
    {
      id: 'operating_hours',
      category: 'general',
      label: 'Operating Hours',
      description: 'Normal business hours',
      value: '8:00 PM - 4:00 AM',
      type: 'text'
    },
    
    // POS Settings
    {
      id: 'tax_rate',
      category: 'pos',
      label: 'Tax Rate (%)',
      description: 'The default sales tax percentage applied to orders',
      value: 8.5,
      type: 'number'
    },
    {
      id: 'allow_tabs',
      category: 'pos',
      label: 'Allow Customer Tabs',
      description: 'Enable customers to run a tab throughout their visit',
      value: true,
      type: 'toggle'
    },
    {
      id: 'require_table_number',
      category: 'pos',
      label: 'Require Table Number',
      description: 'Require table number for all orders',
      value: false,
      type: 'toggle'
    },
    {
      id: 'default_payment_method',
      category: 'pos',
      label: 'Default Payment Method',
      description: 'The most commonly used payment method',
      value: 'card',
      type: 'select',
      options: ['cash', 'card', 'mobile']
    },
    
    // Inventory Settings
    {
      id: 'low_stock_threshold',
      category: 'inventory',
      label: 'Default Low Stock Threshold',
      description: 'The percentage threshold for low stock alerts',
      value: 20,
      type: 'number'
    },
    {
      id: 'auto_reorder',
      category: 'inventory',
      label: 'Automatic Reordering',
      description: 'Automatically create purchase orders for low stock items',
      value: false,
      type: 'toggle'
    },
    {
      id: 'inventory_notifications',
      category: 'inventory',
      label: 'Inventory Notifications',
      description: 'Send notifications for low stock and other inventory events',
      value: true,
      type: 'toggle'
    },
    
    // Security Settings
    {
      id: 'require_password_change',
      category: 'security',
      label: 'Require Password Change',
      description: 'Require users to change passwords regularly',
      value: true,
      type: 'toggle'
    },
    {
      id: 'password_expiry_days',
      category: 'security',
      label: 'Password Expiry (Days)',
      description: 'Number of days until passwords expire',
      value: 90,
      type: 'number'
    },
    {
      id: 'session_timeout',
      category: 'security',
      label: 'Session Timeout (Minutes)',
      description: 'How long until an inactive session is logged out',
      value: 30,
      type: 'number'
    },
    {
      id: 'two_factor_auth',
      category: 'security',
      label: 'Two-Factor Authentication',
      description: 'Require two-factor authentication for login',
      value: false,
      type: 'toggle'
    }
  ]);
  
  // Get unique categories from settings
  const categories = Array.from(new Set(settings.map(setting => setting.category)));
  
  // Filter settings by active category
  const filteredSettings = settings.filter(setting => setting.category === activeCategory);
  
  // Handle setting changes
  const updateSetting = (id: string, newValue: string | boolean | number) => {
    setSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === id ? { ...setting, value: newValue } : setting
      )
    );
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would save to the backend
    alert('Settings saved successfully!');
  };
  
  return (
    <div className="h-full">
      <PageHeader title="System Settings">
        <button 
          type="submit"
          form="settings-form"
          className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md"
        >
          <i className="ri-save-line mr-1"></i>
          <span>Save Changes</span>
        </button>
      </PageHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-dark-900 mb-4">Categories</h3>
          <ul className="space-y-1">
            {categories.map(category => (
              <li key={category}>
                <button
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-4 py-2 rounded-md capitalize ${
                    activeCategory === category 
                      ? 'bg-primary text-white' 
                      : 'text-dark-900 hover:bg-light-100'
                  }`}
                >
                  {category === 'general' && <i className="ri-settings-4-line mr-2"></i>}
                  {category === 'pos' && <i className="ri-shopping-cart-line mr-2"></i>}
                  {category === 'inventory' && <i className="ri-store-2-line mr-2"></i>}
                  {category === 'security' && <i className="ri-shield-check-line mr-2"></i>}
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Settings Form */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-3">
          <h2 className="text-xl font-semibold text-dark-900 mb-6 capitalize">{activeCategory} Settings</h2>
          
          <form id="settings-form" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {filteredSettings.map(setting => (
                <div key={setting.id} className="border-b border-light-200 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <label htmlFor={setting.id} className="block text-sm font-medium text-dark-900">
                        {setting.label}
                      </label>
                      <p className="text-sm text-light-400">{setting.description}</p>
                    </div>
                    
                    {/* Render different input types based on setting type */}
                    {setting.type === 'toggle' && (
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                        <input
                          type="checkbox"
                          id={setting.id}
                          checked={setting.value as boolean}
                          onChange={(e) => updateSetting(setting.id, e.target.checked)}
                          className="absolute w-0 h-0 opacity-0"
                        />
                        <label
                          htmlFor={setting.id}
                          className={`absolute inset-0 rounded-full cursor-pointer ${
                            (setting.value as boolean) ? 'bg-primary' : 'bg-light-300'
                          }`}
                        >
                          <span 
                            className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ${
                              (setting.value as boolean) ? 'translate-x-6' : ''
                            }`} 
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {setting.type === 'text' && (
                    <input
                      type="text"
                      id={setting.id}
                      value={setting.value as string}
                      onChange={(e) => updateSetting(setting.id, e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-light-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  )}
                  
                  {setting.type === 'number' && (
                    <input
                      type="number"
                      id={setting.id}
                      value={setting.value as number}
                      onChange={(e) => updateSetting(setting.id, parseFloat(e.target.value))}
                      className="w-full mt-1 px-3 py-2 border border-light-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  )}
                  
                  {setting.type === 'select' && (
                    <select
                      id={setting.id}
                      value={setting.value as string}
                      onChange={(e) => updateSetting(setting.id, e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-light-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {setting.options?.map(option => (
                        <option key={option} value={option} className="capitalize">
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
