import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, CheckCircle, XCircle, AlertCircle, BookOpen, FileText, Target, Brain } from 'lucide-react';

const AWSSysOpsExamApp = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const examDomains = [
    { name: 'Monitoring, Logging, and Remediation', weight: '20%' },
    { name: 'Reliability and Business Continuity', weight: '16%' },
    { name: 'Deployment, Provisioning, and Automation', weight: '18%' },
    { name: 'Security and Compliance', weight: '16%' },
    { name: 'Networking and Content Delivery', weight: '18%' },
    { name: 'Cost and Performance Optimization', weight: '12%' }
  ];

  const cheatsheet = {
    'monitoring': {
      title: 'Domain 1: Monitoring, Logging, and Remediation (20%)',
      sections: [
        {
          title: 'CloudWatch',
          content: [
            {
              topic: 'CloudWatch Metrics',
              details: [
                'Default EC2 metrics: CPU, Network, Disk (not memory/disk space)',
                'Custom metrics via PutMetricData API',
                'Metric math for calculations',
                'High-resolution metrics (1-second granularity)',
                'Retention: 15 months (auto-aggregation over time)'
              ],
              resources: [
                { name: 'CloudWatch Metrics Guide', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html' }
              ]
            },
            {
              topic: 'CloudWatch Alarms',
              details: [
                'States: OK, ALARM, INSUFFICIENT_DATA',
                'Actions: SNS, Auto Scaling, EC2 actions',
                'Composite alarms for complex logic',
                'Anomaly detector for ML-based thresholds',
                'Billing alarms in US East 1 only'
              ],
              resources: [
                { name: 'CloudWatch Alarms', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html' }
              ]
            },
            {
              topic: 'CloudWatch Logs',
              details: [
                'Log groups and streams structure',
                'Retention settings (1 day to 10 years)',
                'Metric filters for custom metrics from logs',
                'Insights for query and analysis',
                'Export to S3 (up to 12 hours delay)',
                'Real-time processing with Kinesis/Lambda'
              ],
              resources: [
                { name: 'CloudWatch Logs', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html' }
              ]
            }
          ]
        },
        {
          title: 'AWS Systems Manager',
          content: [
            {
              topic: 'SSM Agent & Session Manager',
              details: [
                'Pre-installed on Amazon Linux 2, Ubuntu 16.04+',
                'No SSH keys or bastion hosts needed',
                'Session logging to S3/CloudWatch',
                'Port forwarding support',
                'IAM-based access control'
              ],
              resources: [
                { name: 'Session Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html' }
              ]
            },
            {
              topic: 'Parameter Store',
              details: [
                'Standard: 4KB, free, no automatic rotation',
                'Advanced: 8KB, charges apply, automatic rotation',
                'Hierarchical storage with paths',
                'Integration with CloudFormation',
                'Version tracking'
              ],
              resources: [
                { name: 'Parameter Store', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html' }
              ]
            },
            {
              topic: 'Patch Manager',
              details: [
                'Patch baselines (predefined or custom)',
                'Maintenance windows for scheduling',
                'Patch groups with tags',
                'Compliance reporting',
                'Multi-account/region with Organizations'
              ],
              resources: [
                { name: 'Patch Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html' }
              ]
            }
          ]
        },
        {
          title: 'EventBridge (CloudWatch Events)',
          content: [
            {
              topic: 'Event Patterns & Rules',
              details: [
                'Event sources: AWS services, custom apps, SaaS',
                'Event patterns for filtering',
                'Schedule expressions (rate, cron)',
                'Targets: Lambda, SNS, SQS, ECS tasks, etc.',
                'Event replay for testing',
                'Schema registry for event structure'
              ],
              resources: [
                { name: 'EventBridge', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/what-is-amazon-eventbridge.html' }
              ]
            }
          ]
        }
      ]
    },
    'reliability': {
      title: 'Domain 2: Reliability and Business Continuity (16%)',
      sections: [
        {
          title: 'High Availability & Fault Tolerance',
          content: [
            {
              topic: 'Multi-AZ Deployments',
              details: [
                'RDS Multi-AZ: Synchronous replication, automatic failover',
                'Aurora: Up to 15 read replicas, automatic failover <30s',
                'EFS: Automatically stores across multiple AZs',
                'S3: Designed for 99.999999999% durability',
                'ALB: Automatically distributes across AZs'
              ],
              resources: [
                { name: 'RDS Multi-AZ', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html' }
              ]
            },
            {
              topic: 'Backup Strategies',
              details: [
                'AWS Backup: Centralized backup across services',
                'RDS automated backups: 1-35 days retention',
                'EBS snapshots: Incremental, stored in S3',
                'AMI creation for EC2 backup',
                'S3 cross-region replication',
                'Point-in-time recovery for DynamoDB'
              ],
              resources: [
                { name: 'AWS Backup', url: 'https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html' }
              ]
            },
            {
              topic: 'Disaster Recovery',
              details: [
                { name: 'RTO (Recovery Time Objective)', text: 'How long you can be down before business impact becomes unacceptable. Example: "Service must be back online within 1 hour." Applies to systems, apps, databases, infrastructure.' },
                { name: 'RPO (Recovery Point Objective)', text: 'How much data loss (in time) you can tolerate after a failure. Example: "Can lose max 15 minutes of data." Applies to databases, storage, backups.' },
                { name: 'Rewind/Backtrack (Aurora)', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.Backtrack.html', text: 'Instantly rewind DB to a specific time without full restore (up to 72 hours). Example: "Undo to state from 3 hours ago." **Aurora MySQL only**.' }
              ],
              image: {
                url: 'https://docs.aws.amazon.com/images/whitepapers/latest/disaster-recovery-of-on-premises-applications-to-aws/images/recoveryobjectives.png',
                alt: 'AWS Disaster Recovery Objectives'
              },
              table: {
                title: 'Typical RTO/RPO Targets',
                headers: ['System Type', 'RTO', 'RPO'],
                rows: [
                  ['Mission-critical (e.g., payments)', '≤ 5 min', '≤ 1 min'],
                  ['Standard business apps', '≤ 1 hr', '≤ 15 min'],
                  ['Non-critical (e.g., reports)', '≤ 24 hr', '≤ 24 hr']
                ]
              },
              strategies: [
                'Backup & Restore: High RPO/RTO, lowest cost',
                'Pilot Light: Critical components always on',
                'Warm Standby: Scaled-down version running',
                'Multi-Site: Full production in multiple regions'
              ],
              resources: [
                { name: 'DR Whitepaper', url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html' }
              ]
            }
          ]
        },
        {
          title: 'Auto Scaling',
          content: [
            {
              topic: 'EC2 Auto Scaling',
              details: [
                'Target tracking: Maintain metric at target',
                'Step scaling: Add/remove based on thresholds',
                'Scheduled scaling: Time-based adjustments',
                'Predictive scaling: ML-based forecasting',
                'Cooldown periods to prevent flapping',
                'Lifecycle hooks for custom actions'
              ],
              resources: [
                { name: 'Auto Scaling Guide', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html' }
              ]
            },
            {
              topic: 'Application Auto Scaling',
              details: [
                'DynamoDB: Read/write capacity',
                'ECS: Task count',
                'Lambda: Concurrent executions',
                'Aurora: Replica count',
                'Custom resources via API'
              ],
              resources: [
                { name: 'Application Auto Scaling', url: 'https://docs.aws.amazon.com/autoscaling/application/userguide/what-is-application-auto-scaling.html' }
              ]
            }
          ]
        }
      ]
    },
    'deployment': {
      title: 'Domain 3: Deployment, Provisioning, and Automation (18%)',
      sections: [
        {
          title: 'CloudFormation',
          content: [
            {
              topic: 'Stack Operations',
              details: [
                'Create/Update/Delete stacks',
                'Change sets for preview',
                'Stack policies to prevent updates',
                'Drift detection for changes',
                'Nested stacks for reusability',
                'StackSets for multi-account/region'
              ],
              resources: [
                { name: 'CloudFormation Guide', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html' }
              ]
            },
            {
              topic: 'Template Components',
              details: [
                'Parameters: Input values',
                'Resources: AWS resources to create',
                'Mappings: Static variables',
                'Conditions: Resource creation logic',
                'Outputs: Return values',
                'Metadata: Additional information'
              ],
              resources: [
                { name: 'Template Anatomy', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html' }
              ]
            },
            {
              topic: 'Intrinsic Functions',
              details: [
                '!Ref: Reference parameters/resources',
                '!GetAtt: Get resource attributes',
                '!Sub: String substitution',
                '!Join: Concatenate values',
                '!Select: Choose from list',
                '!If: Conditional values'
              ],
              resources: [
                { name: 'Intrinsic Functions', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html' }
              ]
            }
          ]
        },
        {
          title: 'Elastic Beanstalk',
          content: [
            {
              topic: 'Deployment Options',
              details: [
                'All at once: Fast but downtime',
                'Rolling: Partial capacity',
                'Rolling with batch: Maintains capacity',
                'Immutable: New ASG, zero downtime',
                'Blue/Green: URL swap via Route 53',
                'Traffic splitting: Canary testing'
              ],
              resources: [
                { name: 'Deployment Options', url: 'https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html' }
              ]
            }
          ]
        },
        {
          title: 'Systems Manager Automation',
          content: [
            {
              topic: 'Run Command',
              details: [
                'Execute commands on EC2/on-premises',
                'No SSH/RDP required',
                'Rate controls for large fleets',
                'Output to S3/CloudWatch',
                'Integration with IAM for access'
              ],
              resources: [
                { name: 'Run Command', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html' }
              ]
            },
            {
              topic: 'Automation Documents',
              details: [
                'Predefined runbooks',
                'Custom automation workflows',
                'Approval actions for manual steps',
                'Integration with Lambda',
                'Cross-account automation'
              ],
              resources: [
                { name: 'Automation', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html' }
              ]
            }
          ]
        }
      ]
    },
    'security': {
      title: 'Domain 4: Security and Compliance (16%)',
      sections: [
        {
          title: 'IAM',
          content: [
            {
              topic: 'Policies',
              details: [
                'Identity-based: Attached to users/groups/roles',
                'Resource-based: Attached to resources',
                'AWS managed vs Customer managed',
                'Policy evaluation: Explicit Deny > Allow',
                'Permission boundaries for maximum permissions',
                'Service Control Policies (SCPs) in Organizations'
              ],
              resources: [
                { name: 'IAM Policies', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html' }
              ]
            },
            {
              topic: 'Roles',
              details: [
                'EC2 instance profiles',
                'Cross-account access',
                'Service roles for AWS services',
                'AssumeRole with STS',
                'External ID for third parties',
                'Session policies for temporary restrictions'
              ],
              resources: [
                { name: 'IAM Roles', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html' }
              ]
            }
          ]
        },
        {
          title: 'Data Protection',
          content: [
            {
              topic: 'Encryption at Rest',
              details: [
                'S3: SSE-S3, SSE-KMS, SSE-C',
                'EBS: Encryption by default setting',
                'RDS: Encryption at creation only',
                'EFS: Encryption at creation',
                'Snapshot encryption inherits from volume'
              ],
              resources: [
                { name: 'S3 Encryption', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryption.html' }
              ]
            },
            {
              topic: 'Encryption in Transit',
              details: [
                'TLS/SSL for HTTPS endpoints',
                'VPN for site-to-site connections',
                'ACM for certificate management',
                'CloudFront for HTTPS distribution',
                'S3 Transfer Acceleration with encryption'
              ],
              resources: [
                { name: 'ACM Guide', url: 'https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html' }
              ]
            }
          ]
        },
        {
          title: 'Compliance & Auditing',
          content: [
            {
              topic: 'AWS Config',
              details: [
                'Configuration history tracking',
                'Compliance rules evaluation',
                'Auto-remediation with SSM',
                'Configuration snapshots',
                'Aggregators for multi-account'
              ],
              resources: [
                { name: 'AWS Config', url: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html' }
              ]
            },
            {
              topic: 'CloudTrail',
              details: [
                'Management events: Control plane',
                'Data events: S3/Lambda operations',
                'Insights: Unusual activity detection',
                'Event history: 90 days free',
                'S3 logging with integrity validation'
              ],
              resources: [
                { name: 'CloudTrail', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html' }
              ]
            }
          ]
        }
      ]
    },
    'networking': {
      title: 'Domain 5: Networking and Content Delivery (18%)',
      sections: [
        {
          title: 'VPC',
          content: [
            {
              topic: 'Subnets & Routing',
              details: [
                'CIDR blocks: /16 to /28',
                'Public subnet: Route to IGW',
                'Private subnet: Route to NAT',
                'Route table priority: Most specific',
                'Local route: Cannot be deleted',
                'VPC Peering: No transitive routing'
              ],
              resources: [
                { name: 'VPC Guide', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html' }
              ]
            },
            {
              topic: 'Security Groups & NACLs',
              details: [
                'Security Groups: Stateful, instance level',
                'NACLs: Stateless, subnet level',
                'SG: Allow only, default deny',
                'NACL: Allow/Deny, rule numbers',
                'NACL evaluation: Lowest number first',
                'Default NACL: Allows all'
              ],
              resources: [
                { name: 'Security Groups', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html' }
              ]
            },
            {
              topic: 'VPC Connectivity',
              details: [
                { name: 'Internet Gateway', text: 'a horizontally scaled, redundant, and highly available VPC component that allows bidirectional communication between your VPC and the internet. It supports IPv4 and IPv6 traffic. It does not cause availability risks or bandwidth constraints on your network traffic.' },
                { name: 'NAT Gateway', text: 'it enables **private subnet instances to connect to internet, other VPCs, on-premises networks**; handles IPv4, IPv6 traffic routing, connectivity types. If you aim **to provide Internet access to private instances, the NAT gateway must be located in a public subnet**.' },
                { name: 'VPC Endpoints', text: 'Private AWS access - Interface Endpoints enable connectivity to a wide range of services, while Gateway Endpoints are specifically designed for routing traffic to Amazon S3 and DynamoDB.' },
                { name: 'VPN', text: 'IPSec encrypted tunnel' },
                { name: 'Direct Connect', text: 'a service establishes a dedicated connection that delivers consistent, low-latency performance from an on-premises network to one or more VPCs' },
                { name: 'Transit Gateway', text: 'a network transit hub used to **interconnect VPCs and on-premises networks**' },
                { name: 'VPC Peering', url: 'https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html', text: 'A VPC peering connection is a **networking connection between two VPCs** that enables you to route traffic between them using private IPv4 addresses or IPv6 addresses. Instances in either VPC can communicate with each other as if they are within the same network. You can create a VPC peering connection between your own VPCs, or with a VPC in another AWS account. The VPCs can be in different Regions (also known as an inter-Region VPC peering connection).' },
                { name: 'VPC Peering VS Transit Gateway', text: "**VPC peering connects two VPCs directly**, making it a simple, low-latency solution for smaller networks, while Transit Gateway connects multiple VPCs, on-premises networks, and VPNs in a hub-and-spoke model, providing centralized management for larger, more complex infrastructures. VPC peering uses a direct, point-to-point connection which is easier for one-to-one needs, but it doesn't scale well as you have to manually manage each peering connection. Transit Gateway is more expensive and introduces a hop, but it scales better, offers centralized routing, and supports hybrid connectivity and transitive routing between VPCs" },
              ],
              resources: [
                { name: 'VPC Connectivity', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/extend-intro.html' }
              ]
            }
          ]
        },
        {
          title: 'Load Balancing',
          content: [
            {
              topic: 'ELB Types',
              details: [
                'ALB: Layer 7, HTTP/HTTPS, path routing',
                'NLB: Layer 4, TCP/UDP, ultra-low latency',
                'CLB: Legacy, avoid for new apps',
                'GWLB: Layer 3, for virtual appliances',
                'Cross-zone load balancing',
                'Connection draining/deregistration delay'
              ],
              resources: [
                { name: 'ELB Guide', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html' }
              ]
            },
            {
              topic: 'Target Groups',
              details: [
                'Instance targets: EC2',
                'IP targets: On-premises, containers',
                'Lambda targets: Serverless',
                'Health checks: HTTP/HTTPS/TCP',
                'Stickiness: Application or duration',
                'Slow start mode for gradual traffic'
              ],
              resources: [
                { name: 'Target Groups', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html' }
              ]
            }
          ]
        },
        {
          title: 'CloudFront',
          content: [
            {
              topic: 'Distribution Settings',
              details: [
                'Origins: S3, ALB, HTTP server',
                'Behaviors: Path patterns, caching',
                'Edge locations: Global caching',
                'TTL: Min, max, default',
                'Invalidations: Remove cached content',
                'Origin Access Identity for S3'
              ],
              resources: [
                { name: 'CloudFront', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html' }
              ]
            }
          ]
        }
      ]
    },
    'optimization': {
      title: 'Domain 6: Cost and Performance Optimization (12%)',
      sections: [
        {
          title: 'Cost Management',
          content: [
            {
              topic: 'EC2 Purchasing Options',
              details: [
                'On-Demand: Pay per second/hour',
                'Reserved: 1-3 years, up to 72% discount',
                'Spot: Up to 90% discount, can be terminated',
                'Savings Plans: Flexible, hourly commitment',
                'Dedicated Hosts: Physical server',
                'Dedicated Instances: Hardware isolation'
              ],
              resources: [
                { name: 'EC2 Pricing', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html' }
              ]
            },
            {
              topic: 'Cost Monitoring',
              details: [
                'Cost Explorer: Visualize spending',
                'Budgets: Alerts for thresholds',
                'Cost Allocation Tags: Track by project',
                'Reserved Instance recommendations',
                'Trusted Advisor: Cost optimization',
                'S3 Storage Classes: Lifecycle policies'
              ],
              resources: [
                { name: 'Cost Explorer', url: 'https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html' }
              ]
            }
          ]
        },
        {
          title: 'Performance Optimization',
          content: [
            {
              topic: 'Compute Optimization',
              details: [
                'Right-sizing: Match instance to workload',
                'Compute Optimizer recommendations',
                'Burstable instances (T3/T4g)',
                'Instance store for temporary data',
                'Placement groups for network performance',
                'Enhanced networking (SR-IOV)'
              ],
              resources: [
                { name: 'Compute Optimizer', url: 'https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is.html' }
              ]
            },
            {
              topic: 'Storage Optimization',
              details: [
                'EBS: GP3 for cost/performance',
                'EBS-optimized instances',
                'S3 Transfer Acceleration',
                'S3 Intelligent-Tiering',
                'EFS: Performance modes',
                'CloudFront for static content'
              ],
              resources: [
                { name: 'EBS Optimization', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html' }
              ]
            }
          ]
        }
      ]
    }
  };

  const practiceQuestions = [
    {
      id: 1,
      domain: 'Monitoring',
      question: 'A SysOps administrator needs to monitor memory utilization on Amazon EC2 instances. What is the MOST efficient way to accomplish this?',
      options: [
        'Enable detailed monitoring in EC2',
        'Install CloudWatch agent and configure custom metrics',
        'Use AWS Systems Manager to query memory',
        'Check memory usage in EC2 console'
      ],
      correct: 1,
      explanation: 'CloudWatch does not collect memory metrics by default. You must install the CloudWatch agent and configure it to collect memory utilization as a custom metric.'
    },
    {
      id: 2,
      domain: 'Reliability',
      question: 'A company needs to ensure their RDS database can recover with minimal data loss. The RTO is 1 hour and RPO is 5 minutes. Which solution meets these requirements?',
      options: [
        'Enable automated backups with 5-minute backup window',
        'Configure Multi-AZ deployment',
        'Create read replicas in multiple regions',
        'Take manual snapshots every 5 minutes'
      ],
      correct: 1,
      explanation: 'Multi-AZ provides synchronous replication with automatic failover, meeting the 5-minute RPO and 1-hour RTO requirements. Automated backups alone cannot achieve a 5-minute RPO.'
    },
    {
      id: 3,
      domain: 'Deployment',
      question: 'A CloudFormation stack update fails and rolls back. How can the SysOps administrator identify what caused the failure?',
      options: [
        'Check CloudTrail for API calls',
        'Review CloudFormation event history',
        'Enable CloudWatch Logs for the stack',
        'Use AWS Config to track changes'
      ],
      correct: 1,
      explanation: 'CloudFormation event history shows detailed information about each resource creation/update, including error messages for failures.'
    },
    {
      id: 4,
      domain: 'Security',
      question: 'An EC2 instance needs to access S3 buckets but should not have long-term credentials. What is the BEST solution?',
      options: [
        'Store access keys in Parameter Store',
        'Use IAM instance profile with role',
        'Generate temporary credentials with STS',
        'Encrypt credentials in user data'
      ],
      correct: 1,
      explanation: 'IAM instance profiles automatically provide temporary credentials to EC2 instances through the instance metadata service, following security best practices.'
    },
    {
      id: 5,
      domain: 'Networking',
      question: 'A web application in a private subnet needs to download updates from the internet. What should be configured?',
      options: [
        'Internet Gateway',
        'NAT Gateway',
        'VPC Peering',
        'VPN Gateway'
      ],
      correct: 1,
      explanation: 'NAT Gateway allows instances in private subnets to initiate outbound internet connections while preventing inbound connections from the internet.'
    },
    {
      id: 6,
      domain: 'Cost Optimization',
      question: 'A company runs batch processing jobs that can be interrupted. Which EC2 purchasing option provides the MOST cost savings?',
      options: [
        'On-Demand Instances',
        'Reserved Instances',
        'Spot Instances',
        'Dedicated Hosts'
      ],
      correct: 2,
      explanation: 'Spot Instances offer up to 90% discount compared to On-Demand prices and are ideal for interruptible workloads like batch processing.'
    },
    {
      id: 7,
      domain: 'Monitoring',
      question: 'An administrator needs to automatically restart an EC2 instance when it fails system status checks. What should be configured?',
      options: [
        'CloudWatch alarm with EC2 recover action',
        'Auto Scaling group with health checks',
        'Systems Manager automation document',
        'Lambda function triggered by EventBridge'
      ],
      correct: 0,
      explanation: 'CloudWatch alarms can be configured to automatically recover EC2 instances when they fail system status checks, migrating the instance to new hardware if needed.'
    },
    {
      id: 8,
      domain: 'Security',
      question: 'Which AWS service should be used to detect and alert on changes to security group rules?',
      options: [
        'AWS Shield',
        'AWS WAF',
        'AWS Config',
        'Amazon GuardDuty'
      ],
      correct: 2,
      explanation: 'AWS Config tracks configuration changes to AWS resources including security groups and can trigger alerts through Config Rules when unwanted changes occur.'
    }
  ];

  
  const splitSentences = (text) => {
    return text.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()) || [text];
  };
  
  const parseBoldText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => 
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    ).filter(part => part !== '');
  };
  
  const renderCheatsheetSection = (sectionData) => {
    return (
      <div className="space-y-6">
        {sectionData.sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection(`${sectionData.title}-${idx}`)}
              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
              {expandedSections[`${sectionData.title}-${idx}`] ? 
                <ChevronDown className="w-5 h-5 text-gray-600" /> : 
                <ChevronRight className="w-5 h-5 text-gray-600" />
              }
            </button>
            
            {expandedSections[`${sectionData.title}-${idx}`] && (
              <div className="px-6 py-4 space-y-4">
                {section.content.map((item, itemIdx) => (
                  <div key={itemIdx} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{item.topic}</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                      {item.details.map((detail, detailIdx) => (
                        <li key={detailIdx}>
                          {typeof detail === 'string' ? detail : (
                            <>
                              <strong>
                                {detail.url ? (
                                  <a href={detail.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                    {detail.name}
                                  </a>
                                ) : detail.name}:
                              </strong>                              <ul className="list-disc list-inside ml-6 mt-1 space-y-0.5">
                                {splitSentences(detail.text).map((sentence, sIdx) => (
                                  <li key={sIdx}>{parseBoldText(sentence)}</li>
                                ))}
                              </ul>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                    {item.image && (
                      <div className="mt-4 flex justify-center">
                        <img src={item.image.url} alt={item.image.alt || 'Diagram'} className="max-w-full md:max-w-2xl h-auto rounded-lg border border-gray-300" />
                      </div>
                    )}
                    {item.table && (
                      <div className="mt-4 overflow-x-auto">
                        <p className="text-sm font-semibold text-gray-700 mb-2">{item.table.title}</p>
                        <table className="min-w-full border border-gray-300 text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              {item.table.headers.map((header, hIdx) => (
                                <th key={hIdx} className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {item.table.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-gray-50">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="border border-gray-300 px-3 py-2 text-gray-600">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {item.strategies && (
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-gray-700 mb-1">DR Strategies:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                          {item.strategies.map((strategy, sIdx) => (
                            <li key={sIdx}>{strategy}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.resources && (
                      <div className="mt-3 space-y-1">
                        {item.resources.map((resource, resIdx) => (
                          <a
                            key={resIdx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {resource.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderQuestion = (question) => {
    const isAnswered = selectedAnswers[question.id] !== undefined;
    const isCorrect = selectedAnswers[question.id] === question.correct;
    
    return (
      <div key={question.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {question.domain}
          </span>
          <p className="text-gray-800 font-medium flex-1">{question.question}</p>
        </div>
        
        <div className="space-y-2 mb-4">
          {question.options.map((option, idx) => (
            <label
              key={idx}
              className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedAnswers[question.id] === idx
                  ? isAnswered && showAnswers[question.id]
                    ? idx === question.correct
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={idx}
                checked={selectedAnswers[question.id] === idx}
                onChange={() => setSelectedAnswers(prev => ({ ...prev, [question.id]: idx }))}
                className="mr-3"
              />
              <span className="text-gray-700">{option}</span>
              {showAnswers[question.id] && idx === question.correct && (
                <CheckCircle className="w-5 h-5 text-green-600 inline-block ml-2" />
              )}
            </label>
          ))}
        </div>
        
        <button
          onClick={() => setShowAnswers(prev => ({ ...prev, [question.id]: true }))}
          disabled={selectedAnswers[question.id] === undefined}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedAnswers[question.id] === undefined
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Check Answer
        </button>
        
        {showAnswers[question.id] && (
          <div className={`mt-4 p-4 rounded-lg ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-start gap-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              )}
              <p className="text-gray-700 text-sm">{question.explanation}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">AWS SysOps Administrator Exam Reference</h1>
          <p className="text-orange-100">Complete guide to ace the SOA-C02 exam with a perfect score</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-1 mb-6">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Target className="w-4 h-4 inline-block mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('cheatsheet')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'cheatsheet' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4 inline-block mr-2" />
              Cheatsheet
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'practice' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Brain className="w-4 h-4 inline-block mr-2" />
              Practice Questions
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'resources' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4 inline-block mr-2" />
              Resources
            </button>
          </div>
        </div>
        
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Exam Overview</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Exam Details</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Exam Code: SOA-C02</li>
                    <li>• Duration: 180 minutes</li>
                    <li>• Questions: 65 (scenario-based and multiple choice)</li>
                    <li>• Passing Score: 720/1000</li>
                    <li>• Cost: $150 USD</li>
                    <li>• Languages: English, Japanese, Korean, Simplified Chinese</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Key Success Factors</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Hands-on experience with AWS services</li>
                    <li>• Understanding of monitoring and automation</li>
                    <li>• Knowledge of security best practices</li>
                    <li>• Cost optimization strategies</li>
                    <li>• Troubleshooting skills</li>
                    <li>• Disaster recovery planning</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Exam Domains</h2>
              <div className="space-y-3">
                {examDomains.map((domain, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-800">{domain.name}</span>
                    <span className="text-orange-600 font-semibold">{domain.weight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'cheatsheet' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                💡 <strong>Pro Tip:</strong> Focus on hands-on practice with these services. The exam tests practical knowledge, not memorization.
              </p>
            </div>
            {Object.entries(cheatsheet).map(([key, data]) => (
              <div key={key}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">{data.title}</h2>
                {renderCheatsheetSection(data)}
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'practice' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">Practice Questions</h2>
              <p className="text-gray-600">Test your knowledge with these exam-style questions covering all domains.</p>
            </div>
            {practiceQuestions.map(question => renderQuestion(question))}
          </div>
        )}
        
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Essential Resources</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Official AWS Resources</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://aws.amazon.com/certification/certified-sysops-admin-associate/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        AWS Certified SysOps Administrator - Associate
                      </a>
                    </li>
                    <li>
                      <a href="https://d1.awsstatic.com/training-and-certification/docs-sysops-associate/AWS-Certified-SysOps-Administrator-Associate_Exam-Guide.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Exam Guide (PDF)
                      </a>
                    </li>
                    <li>
                      <a href="https://d1.awsstatic.com/training-and-certification/docs-sysops-associate/AWS-Certified-SysOps-Administrator-Associate_Sample-Questions.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Sample Questions (PDF)
                      </a>
                    </li>
                    <li>
                      <a href="https://aws.amazon.com/training/digital/aws-certified-sysops-administrator-associate/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Official Digital Training
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">AWS Documentation</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/welcome.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Well-Architected Framework - Operational Excellence
                      </a>
                    </li>
                    <li>
                      <a href="https://aws.amazon.com/architecture/well-architected/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        AWS Well-Architected
                      </a>
                    </li>
                    <li>
                      <a href="https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Overview of Amazon Web Services
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Hands-On Practice</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://aws.amazon.com/training/digital/aws-cloud-quest/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        AWS Cloud Quest (Gamified Learning)
                      </a>
                    </li>
                    <li>
                      <a href="https://wellarchitectedlabs.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Well-Architected Labs
                      </a>
                    </li>
                    <li>
                      <a href="https://aws.amazon.com/getting-started/hands-on/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        AWS Hands-On Tutorials
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Study Tips</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2 text-gray-700">
                      <li>• Create a test AWS account for hands-on practice</li>
                      <li>• Focus on understanding concepts, not memorizing</li>
                      <li>• Practice with AWS CLI and automation tools</li>
                      <li>• Join AWS study groups and forums</li>
                      <li>• Take practice exams to identify weak areas</li>
                      <li>• Review AWS service limits and quotas</li>
                      <li>• Understand troubleshooting methodologies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AWSSysOpsExamApp;
