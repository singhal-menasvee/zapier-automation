// Define interfaces for your workflow templates

/**
 * @interface WorkflowTemplate
 * @description Represents a single workflow template available in the system.
 */
export interface WorkflowTemplate {
  id: string; // Unique identifier for the template
  name: string; // Display name of the template (e.g., "Automate Event Reminders")
  description: string; // A brief description of what the template does
  category: string; // Category of the template (e.g., "Productivity", "Marketing", "Blockchain")
  // You might include a representation of the workflow structure itself here,
  // or a reference to where the full workflow definition is stored.
  // For example:
  // workflowDefinition: any; // Could be a JSON object representing the nodes and connections
  // or a string that points to a specific workflow definition ID.
  createdAt: Date; // Date when the template was created
  updatedAt: Date; // Date when the template was last updated
  isPublished: boolean; // Whether the template is publicly available
  tags?: string[]; // Optional tags for filtering and searching
  icon?: string; // Optional icon name or URL for display
}

/**
 * @interface WorkflowNodeTemplate
 * @description Represents a single node within a workflow template.
 * This could be used if you want to define templates at a more granular node level.
 */
export interface WorkflowNodeTemplate {
  id: string;
  type: 'trigger' | 'action';
  name: string;
  description: string;
  integration?: { // Optional: if this node involves a specific integration
    name: string;
    icon?: string;
  };
  configSchema?: any; // JSON schema for the node's configuration
}

// Example usage (you would populate this from your backend or static data)
export const predefinedWorkflowTemplates: WorkflowTemplate[] = [
  {
    id: 'template-1',
    name: 'New Google Calendar Event to Slack Notification',
    description: 'Triggers a Slack message when a new event is created in Google Calendar.',
    category: 'Productivity',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublished: true,
    tags: ['Google Calendar', 'Slack', 'Notification'],
    icon: 'calendar-slack',
  },
  {
    id: 'template-2',
    name: 'Automate ETH Transfer on Specific Event',
    description: 'Transfers Ethereum when a predefined on-chain event occurs.',
    category: 'Blockchain',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublished: true,
    tags: ['Ethereum', 'Smart Contract', 'Crypto'],
    icon: 'ethereum',
  },
  // Add more template definitions here
];
