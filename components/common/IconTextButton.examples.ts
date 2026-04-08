// IconTextButton.examples.ts

/**
 * IconTextButton Component Examples
 *
 * @description Example configurations for the IconTextButton component
 * demonstrating various use cases with icon and text combinations
 */

export const iconTextButtonExamples = {
  basicUsage: {
    title: 'Basic Usage',
    description: 'IconTextButton with icon on the left (default)',
    examples: [
      {
        iconSrc: '/assets/images/footer/email-icon.svg',
        iconAlt: 'Email',
        label: 'Send Email',
        ariaLabel: 'Send us an email',
        size: 'md' as const,
      },
      {
        iconSrc: '/assets/images/footer/phone-icon.svg',
        iconAlt: 'Phone',
        label: 'Call Us',
        ariaLabel: 'Call us',
        size: 'md' as const,
      },
      {
        iconSrc: '/assets/images/footer/map-marker.svg',
        iconAlt: 'Location',
        label: 'View Map',
        ariaLabel: 'View our location on map',
        size: 'md' as const,
      },
    ],
  },

  iconPositions: {
    title: 'Icon Positions',
    description: 'Icon can be positioned on the left or right of the label',
    examples: [
      {
        iconSrc: '/assets/images/footer/email-icon.svg',
        iconAlt: 'Email',
        label: 'Send Email',
        iconPosition: 'left' as const,
        ariaLabel: 'Send email (icon left)',
        size: 'md' as const,
      },
      {
        iconSrc: '/assets/images/footer/email-icon.svg',
        iconAlt: 'Email',
        label: 'Send Email',
        iconPosition: 'right' as const,
        ariaLabel: 'Send email (icon right)',
        size: 'md' as const,
      },
    ],
  },

  variants: {
    title: 'Variants',
    description: 'Different button style variants',
    examples: [
      {
        iconSrc: '/assets/images/footer/phone-icon.svg',
        iconAlt: 'Phone',
        label: 'Primary',
        variant: 'primary' as const,
        ariaLabel: 'Primary call button',
        size: 'md' as const,
      },
      {
        iconSrc: '/assets/images/footer/phone-icon.svg',
        iconAlt: 'Phone',
        label: 'Secondary',
        variant: 'secondary' as const,
        ariaLabel: 'Secondary call button',
        size: 'md' as const,
      },
      {
        iconSrc: '/assets/images/footer/phone-icon.svg',
        iconAlt: 'Phone',
        label: 'Outline',
        variant: 'outline' as const,
        ariaLabel: 'Outline call button',
        size: 'md' as const,
      },
      {
        iconSrc: '/assets/images/footer/phone-icon.svg',
        iconAlt: 'Phone',
        label: 'Text',
        variant: 'text' as const,
        ariaLabel: 'Text call button',
        size: 'md' as const,
      },
    ],
  },

  sizes: {
    title: 'Sizes',
    description: 'Different button sizes with icons and text',
    examples: [
      {
        iconSrc: '/assets/images/footer/email-icon.svg',
        iconAlt: 'Email',
        label: 'Small',
        size: 'sm' as const,
        ariaLabel: 'Small email button',
      },
      {
        iconSrc: '/assets/images/footer/email-icon.svg',
        iconAlt: 'Email',
        label: 'Medium',
        size: 'md' as const,
        ariaLabel: 'Medium email button',
      },
      {
        iconSrc: '/assets/images/footer/email-icon.svg',
        iconAlt: 'Email',
        label: 'Large',
        size: 'lg' as const,
        ariaLabel: 'Large email button',
      },
      {
        iconSrc: '/assets/images/footer/email-icon.svg',
        iconAlt: 'Email',
        label: 'Fit Content',
        size: 'fit' as const,
        ariaLabel: 'Fit content email button',
      },
    ],
  },

  states: {
    title: 'States',
    description: 'Different button states',
    examples: [
      {
        iconSrc: '/assets/images/footer/email-icon.svg',
        iconAlt: 'Email',
        label: 'Normal',
        ariaLabel: 'Normal state button',
        size: 'md' as const,
        disabled: false,
        busy: false,
      },
      {
        iconSrc: '/assets/images/footer/email-icon.svg',
        iconAlt: 'Email',
        label: 'Disabled',
        ariaLabel: 'Disabled button',
        size: 'md' as const,
        disabled: true,
        busy: false,
      },
      {
        iconSrc: '/assets/images/footer/email-icon.svg',
        iconAlt: 'Email',
        label: 'Loading',
        ariaLabel: 'Loading button',
        size: 'md' as const,
        disabled: false,
        busy: true,
      },
    ],
  },

  socialMedia: {
    title: 'Social Media Links',
    description: 'Social media buttons with icons and labels',
    examples: [
      {
        iconSrc: '/assets/images/footer/facebook-icon.svg',
        iconAlt: 'Facebook',
        label: 'Facebook',
        ariaLabel: 'Visit our Facebook page',
        variant: 'primary' as const,
        size: 'md' as const,
      },
      {
        iconSrc: '/assets/images/footer/instagram-icon.svg',
        iconAlt: 'Instagram',
        label: 'Instagram',
        ariaLabel: 'Visit our Instagram page',
        variant: 'primary' as const,
        size: 'md' as const,
      },
      {
        iconSrc: '/assets/images/footer/linkedin-icon.svg',
        iconAlt: 'LinkedIn',
        label: 'LinkedIn',
        ariaLabel: 'Visit our LinkedIn page',
        variant: 'primary' as const,
        size: 'md' as const,
      },
    ],
  },

  contactActions: {
    title: 'Contact Actions',
    description: 'Contact method buttons with clear labels',
    examples: [
      {
        iconSrc: '/assets/images/footer/email-icon.svg',
        iconAlt: 'Email',
        label: 'info@tricolorscreen.se',
        ariaLabel: 'Send email to info@tricolorscreen.se',
        variant: 'secondary' as const,
        size: 'fit' as const,
      },
      {
        iconSrc: '/assets/images/footer/phone-icon.svg',
        iconAlt: 'Phone',
        label: '+46 123 456 789',
        ariaLabel: 'Call us at +46 123 456 789',
        variant: 'secondary' as const,
        size: 'fit' as const,
      },
      {
        iconSrc: '/assets/images/footer/map-marker.svg',
        iconAlt: 'Location',
        label: 'View on Map',
        ariaLabel: 'View our location on Google Maps',
        variant: 'secondary' as const,
        size: 'fit' as const,
      },
    ],
  },

  customColors: {
    title: 'Custom Colors',
    description: 'Buttons with custom background and icon colors',
    examples: [
      {
        iconSrc: '/assets/images/footer/phone-icon.svg',
        iconAlt: 'Emergency',
        label: 'Emergency',
        ariaLabel: 'Emergency call',
        size: 'fit' as const,
        backgroundColor: '#ef4444',
        backgroundColorHover: '#dc2626',
      },
      {
        iconSrc: '/assets/images/footer/email-icon.svg',
        iconAlt: 'Success',
        label: 'Send Success',
        ariaLabel: 'Send success email',
        size: 'fit' as const,
        backgroundColor: '#10b981',
        backgroundColorHover: '#059669',
      },
      {
        iconSrc: '/assets/images/footer/map-marker.svg',
        iconAlt: 'Location',
        label: 'Premium Location',
        ariaLabel: 'View premium location',
        size: 'fit' as const,
        backgroundColor: '#8b5cf6',
        backgroundColorHover: '#7c3aed',
      },
    ],
  },
}
