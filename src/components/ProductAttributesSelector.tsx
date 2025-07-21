'use client';
import React, { useState, useEffect } from 'react';

interface AttributeOption {
  label: string;
  price?: number;
  isDefault?: boolean;
}
interface Attribute {
  id?: string;
  name: string;
  options: AttributeOption[];
}

interface ProductAttributesSelectorProps {
  attributes: Attribute[];
  onSelectionChange?: (selected: { [key: string]: AttributeOption | null }) => void;
}

export default function ProductAttributesSelector({ attributes, onSelectionChange }: ProductAttributesSelectorProps) {
  const [selected, setSelected] = useState<{ [key: string]: AttributeOption | null }>(() => {
    const initial: { [key: string]: AttributeOption | null } = {};
    attributes.forEach(attr => {
      const def = attr.options.find(opt => opt.isDefault);
      initial[attr.name] = def || null;
    });
    return initial;
  });

  useEffect(() => {
    if (onSelectionChange) onSelectionChange(selected);
  }, [selected, onSelectionChange]);

  return (
    <div className="space-y-4">
      {attributes.map(attr => (
        <div key={attr.name} className="mb-4">
          <div className="font-medium mb-1">{attr.name}:</div>
          <div className="flex flex-row gap-2">
            {attr.options.map(opt => {
              const isSelected = selected[attr.name]?.label === opt.label;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSelected(s => ({ ...s, [attr.name]: opt }))}
                  className={`px-4 py-2 rounded-3xl
 border transition-all font-medium
                    ${isSelected ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-800 border-gray-300 hover:border-orange-400 hover:bg-orange-50'}
                  `}
                >
                  {opt.label}
                  {opt.price ? ` (+${opt.price}₺)` : ''}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 