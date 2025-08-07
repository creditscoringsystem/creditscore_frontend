// app/(dashboard)/settings/components/AccountLinking.tsx   (ví dụ path)
// hoặc đặt nơi bạn muốn – nhớ đổi đường dẫn import Icon / Button cho phù hợp
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

/* ---------- Kiểu dữ liệu ---------- */
type LinkedAccount = {
  connected: boolean;
  lastSync: string;
};

type LinkedAccountsState = Record<string, LinkedAccount>;

type Service = {
  id: string;
  name: string;
  icon: string;          // tên icon trong lucide-react
  description: string;
  color: string;         // lớp màu tailwind
};

/* ---------- Component ---------- */
const AccountLinking: React.FC = () => {
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccountsState>({
    equifax: { connected: true, lastSync: '2 hours ago' },
    experian: { connected: true, lastSync: '1 day ago' },
    transunion: { connected: false, lastSync: 'Never' },
    creditKarma: { connected: true, lastSync: '3 hours ago' },
    bankAccount: { connected: false, lastSync: 'Never' }
  });

  /* ---- Dữ liệu dịch vụ ---- */
  const creditBureaus: Service[] = [
    {
      id: 'equifax',
      name: 'Equifax',
      icon: 'Shield',
      description: 'Connect to monitor your Equifax credit report',
      color: 'text-blue-400'
    },
    {
      id: 'experian',
      name: 'Experian',
      icon: 'BarChart',
      description: 'Connect to access your Experian credit data',
      color: 'text-green-400'
    },
    {
      id: 'transunion',
      name: 'TransUnion',
      icon: 'TrendingUp',
      description: 'Connect to retrieve your TransUnion information',
      color: 'text-purple-400'
    }
  ];

  const additionalServices: Service[] = [
    {
      id: 'creditKarma',
      name: 'Credit Karma',
      icon: 'CreditCard',
      description: 'Import scores and recommendations',
      color: 'text-primary'
    },
    {
      id: 'bankAccount',
      name: 'Bank Account',
      icon: 'Building',
      description: 'Link your primary bank account for better insights',
      color: 'text-yellow-400'
    }
  ];

  /* ---- handlers ---- */
  const handleConnect = (serviceId: string) => {
    setLinkedAccounts(prev => ({
      ...prev,
      [serviceId]: { connected: true, lastSync: 'Just now' }
    }));
  };

  const handleDisconnect = (serviceId: string) => {
    setLinkedAccounts(prev => ({
      ...prev,
      [serviceId]: { connected: false, lastSync: 'Never' }
    }));
  };

  /* ---- ServiceCard sub-component ---- */
  const ServiceCard: React.FC<{
    service: Service;
    isConnected: boolean;
    lastSync: string;
  }> = ({ service, isConnected, lastSync }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-muted/50 rounded-lg p-4 neon-border-glow hover-lift"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div
            className={`w-12 h-12 rounded-lg bg-card flex items-center justify-center neon-border-glow ${
              isConnected ? 'bg-primary/20' : 'bg-muted'
            }`}
          >
            <Icon
              name={service.icon}
              size={20}
              className={isConnected ? service.color : 'text-muted-foreground'}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-foreground">{service.name}</h4>
              {isConnected && <div className="w-2 h-2 bg-success rounded-full neon-glow" />}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
            <div className="text-xs text-muted-foreground">Last sync: {lastSync}</div>
          </div>
        </div>

        <div className="flex space-x-2">
          {isConnected ? (
            <>
              <Button variant="outline" size="sm" className="neon-border-glow">
                <Icon name="RefreshCw" size={14} className="mr-1" />
                Sync
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDisconnect(service.id)}
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Icon name="Unlink" size={14} className="mr-1" />
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => handleConnect(service.id)}
              className="neon-glow hover:scale-105 transition-all duration-200"
            >
              <Icon name="Link" size={14} className="mr-1" />
              Connect
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );

  /* ---- render ---- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-lg border border-border p-6 shadow-elevation-2 neon-border-glow"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2 neon-text-glow">
          Account Linking
        </h3>
        <p className="text-muted-foreground">
          Connect your credit monitoring and banking accounts for comprehensive insights
        </p>
      </div>

      {/* Credit Bureaus */}
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Shield" size={18} className="text-primary" />
            <span>Credit Bureaus</span>
          </h4>
          <div className="space-y-3">
            {creditBureaus.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isConnected={linkedAccounts[service.id]?.connected}
                lastSync={linkedAccounts[service.id]?.lastSync}
              />
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div>
          <h4 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Link" size={18} className="text-primary" />
            <span>Additional Services</span>
          </h4>
          <div className="space-y-3">
            {additionalServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isConnected={linkedAccounts[service.id]?.connected}
                lastSync={linkedAccounts[service.id]?.lastSync}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 pt-4 border-t border-border"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-foreground">Connection Status</div>
            <div className="text-sm text-muted-foreground">
              {
                Object.values(linkedAccounts).filter((account) => account.connected)
                  .length
              }{' '}
              of {Object.keys(linkedAccounts).length} services connected
            </div>
          </div>
          <Button variant="outline" className="neon-border-glow">
            <Icon name="Settings" size={16} className="mr-2" />
            Privacy Settings
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AccountLinking;
