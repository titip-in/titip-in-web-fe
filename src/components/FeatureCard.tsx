import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
  borderColor?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  bgColor,
  iconColor,
  borderColor = "border-border-shadow-xs",
}) => {
  return (
    <div className={`bg-white p-6 rounded-lg ${borderColor} hover:border-shadow-md transition-all`}>
      <div className="flex items-center mb-4">
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center mr-3`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-display text-charcoal mb-2">
            {title}
          </h3>
          <p className="text-sm text-charcoal-40">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};