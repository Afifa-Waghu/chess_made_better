import React from 'react';
import { Handshake } from 'lucide-react';

interface DrawOfferModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  offeringPlayerName: string;
  theme: any;
}

export const DrawOfferModal: React.FC<DrawOfferModalProps> = ({
  isOpen,
  onAccept,
  onDecline,
  offeringPlayerName,
  theme
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center">
        <div className="mb-4">
          <Handshake className="mx-auto text-green-500" size={48} />
        </div>
        
        <h3 className="text-xl font-bold mb-4" style={{ color: theme.primary }}>
          Draw Offer
        </h3>
        
        <p className="text-gray-600 mb-6">
          <strong>{offeringPlayerName}</strong> is offering a draw. 
          Do you accept?
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
          >
            Accept Draw
          </button>
        </div>
      </div>
    </div>
  );
};