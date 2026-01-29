import type { GroupBase } from 'react-select'
import type { RoleOption } from '../types'

export const ROLE_OPTIONS: GroupBase<RoleOption>[] = [
  {
    label: 'Design',
    options: [
      { value: 'ux-ui-designer', label: 'UX/UI Designer', group: 'Design' },
      { value: 'product-designer', label: 'Product Designer', group: 'Design' },
      { value: 'interaction-designer', label: 'Interaction Designer', group: 'Design' },
      { value: 'visual-designer', label: 'Visual Designer', group: 'Design' },
      { value: 'design-systems-engineer', label: 'Design Systems Engineer', group: 'Design' },
    ],
  },
  {
    label: 'Frontend',
    options: [
      { value: 'frontend-developer', label: 'Frontend Developer', group: 'Frontend' },
      { value: 'react-developer', label: 'React Developer', group: 'Frontend' },
      { value: 'css-styling-specialist', label: 'CSS/Styling Specialist', group: 'Frontend' },
      { value: 'accessibility-specialist', label: 'Accessibility Specialist', group: 'Frontend' },
      { value: 'animation-motion-developer', label: 'Animation/Motion Developer', group: 'Frontend' },
    ],
  },
  {
    label: 'Backend',
    options: [
      { value: 'backend-developer', label: 'Backend Developer', group: 'Backend' },
      { value: 'api-designer', label: 'API Designer', group: 'Backend' },
      { value: 'database-engineer', label: 'Database Engineer', group: 'Backend' },
      { value: 'systems-programmer', label: 'Systems Programmer', group: 'Backend' },
    ],
  },
  {
    label: 'Mobile',
    options: [
      { value: 'ios-developer', label: 'iOS Developer (Swift/SwiftUI)', group: 'Mobile' },
      { value: 'android-developer', label: 'Android Developer (Kotlin)', group: 'Mobile' },
      { value: 'react-native-developer', label: 'React Native Developer', group: 'Mobile' },
      { value: 'flutter-developer', label: 'Flutter Developer', group: 'Mobile' },
    ],
  },
  {
    label: 'Infrastructure',
    options: [
      { value: 'devops-engineer', label: 'DevOps Engineer', group: 'Infrastructure' },
      { value: 'cloud-architect', label: 'Cloud Architect', group: 'Infrastructure' },
      { value: 'site-reliability-engineer', label: 'Site Reliability Engineer', group: 'Infrastructure' },
      { value: 'security-engineer', label: 'Security Engineer', group: 'Infrastructure' },
    ],
  },
  {
    label: 'Architecture & Leadership',
    options: [
      { value: 'software-architect', label: 'Software Architect', group: 'Architecture & Leadership' },
      { value: 'technical-lead', label: 'Technical Lead', group: 'Architecture & Leadership' },
      { value: 'staff-engineer', label: 'Staff Engineer', group: 'Architecture & Leadership' },
    ],
  },
  {
    label: 'Specialized',
    options: [
      { value: 'performance-engineer', label: 'Performance Engineer', group: 'Specialized' },
      { value: 'data-engineer', label: 'Data Engineer', group: 'Specialized' },
      { value: 'ml-ai-engineer', label: 'ML/AI Engineer', group: 'Specialized' },
      { value: 'technical-writer', label: 'Technical Writer', group: 'Specialized' },
      { value: 'qa-test-engineer', label: 'QA/Test Engineer', group: 'Specialized' },
      { value: 'creative-technologist', label: 'Creative Technologist', group: 'Specialized' },
    ],
  },
]
