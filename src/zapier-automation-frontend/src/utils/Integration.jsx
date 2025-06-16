import {
  faEnvelope,
  faBolt,
  faCode,
  faTable,
  faCalendar,
  faFile,
  faCommentDots,
  faDatabase,
  faGear,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

import {
  faGoogle,
  faSlack,
  faDiscord,
  
} from '@fortawesome/free-brands-svg-icons';

export const integrations = [
  { name: "Gmail", icon: faEnvelope },
  { name: "Slack", icon: faSlack },
  { name: "Discord", icon: faDiscord },
  
  { name: "Google Calendar", icon: faCalendar },
  { name: "Google Sheets", icon: faTable },
  { name: "Webhook", icon: faBolt },
  { name: "Code", icon: faCode },
  { name: "Database", icon: faDatabase },
  { name: "Settings", icon: faGear },
  { name: "Analytics", icon: faChartLine },
];
