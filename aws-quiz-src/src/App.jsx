import React, { useState } from 'react';
import { Shield, Lock, Eye, AlertTriangle, FileSearch, Key, Database, Users, Cloud, ExternalLink, ChevronDown, ChevronRight, CheckCircle, XCircle, AlertCircle, BookOpen, FileText, Target, Brain } from 'lucide-react';

const AWSSecuritySpecialtyApp = () => {
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
    { name: 'Threat Detection and Incident Response', weight: '14%', icon: AlertTriangle },
    { name: 'Security Logging and Monitoring', weight: '18%', icon: FileSearch },
    { name: 'Infrastructure Security', weight: '20%', icon: Shield },
    { name: 'Identity and Access Management', weight: '16%', icon: Users },
    { name: 'Data Protection', weight: '18%', icon: Lock },
    { name: 'Management and Security Governance', weight: '14%', icon: Cloud }
  ];

  const cheatsheet = {
    'threat-detection': {
      title: 'Domain 1: Threat Detection and Incident Response (14%)',
      sections: [
        {
          title: 'Amazon GuardDuty',
          content: [
            {
              topic: 'Threat Detection',
              details: [
                'ML-based threat detection across AWS accounts',
                'Analyzes: VPC Flow Logs, CloudTrail, DNS logs, EKS audit logs',
                'Threat intelligence feeds: AWS and third-party',
                'Findings severity: High, Medium, Low',
                'Multi-account with delegated administrator',
                'EventBridge integration for automated response',
                'Suppression rules for false positives'
              ],
              resources: [
                { name: 'GuardDuty User Guide', url: 'https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html' },
                { name: 'GuardDuty Finding Types', url: 'https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-active.html' }
              ]
            },
            {
              topic: 'GuardDuty for Containers',
              details: [
                'EKS Protection: Runtime monitoring',
                'ECS Protection: Runtime monitoring (preview)',
                'Detects: Cryptocurrency mining, privilege escalation',
                'Container runtime events analysis',
                'Kubernetes audit logs analysis',
                'Agent-based for runtime protection'
              ],
              resources: [
                { name: 'EKS Protection', url: 'https://docs.aws.amazon.com/guardduty/latest/ug/kubernetes-protection.html' }
              ]
            }
          ]
        },
        {
          title: 'AWS Security Hub',
          content: [
            {
              topic: 'Security Standards',
              details: [
                'AWS Foundational Security Best Practices',
                'CIS AWS Foundations Benchmark',
                'PCI DSS, NIST, ISO 27001 compliance',
                'Automated security checks',
                'Security score calculation',
                'Custom security standards support',
                'Cross-region aggregation'
              ],
              resources: [
                { name: 'Security Hub Guide', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html' },
                { name: 'Security Standards', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards.html' }
              ]
            },
            {
              topic: 'Findings and Insights',
              details: [
                'Aggregates findings from: GuardDuty, Inspector, Macie',
                'ASFF (AWS Security Finding Format)',
                'Workflow status: NEW, NOTIFIED, SUPPRESSED, RESOLVED',
                'Insights for finding patterns',
                'Custom actions via EventBridge',
                'Integration with ticketing systems'
              ],
              resources: [
                { name: 'ASFF Syntax', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-findings-format.html' }
              ]
            }
          ]
        },
        {
          title: 'Incident Response',
          content: [
            {
              topic: 'AWS Detective',
              details: [
                'Investigation of security findings',
                'Analyzes up to 1 year of data',
                'Entity behavior graphs',
                'Integration with GuardDuty findings',
                'VPC Flow Logs, CloudTrail analysis',
                'Finding groups for related activities',
                'No additional logging required'
              ],
              resources: [
                { name: 'Detective Guide', url: 'https://docs.aws.amazon.com/detective/latest/userguide/detective-investigation-about.html' }
              ]
            },
            {
              topic: 'Incident Response Automation',
              details: [
                'EventBridge rules for automated response',
                'Lambda functions for remediation',
                'SSM runbooks for incident handling',
                'Step Functions for complex workflows',
                'SNS for notifications',
                'Isolation: Security group changes, NACL updates',
                'Forensics: EBS snapshots, memory dumps'
              ],
              resources: [
                { name: 'IR Automation', url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-security-incident-response-guide/automation.html' }
              ]
            }
          ]
        }
      ]
    },
    'logging-monitoring': {
      title: 'Domain 2: Security Logging and Monitoring (18%)',
      sections: [
        {
          title: 'CloudTrail',
          content: [
            {
              topic: 'Event Types and Configuration',
              details: [
                'Management Events: Control plane operations',
                'Data Events: S3 object/Lambda function level',
                'Insights Events: Unusual API activity detection',
                'Event history: 90 days (free)',
                'Trails: Single region or all regions',
                'Organization trail for all accounts',
                'Event selectors for filtering'
              ],
              resources: [
                { name: 'CloudTrail Concepts', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html' },
                { name: 'Event Reference', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference.html' }
              ]
            },
            {
              topic: 'Log File Integrity',
              details: [
                'Log file validation with digest files',
                'SHA-256 hashing for integrity',
                'Digest files contain previous digest reference',
                'AWS CLI validate-logs command',
                'Cannot be disabled once enabled',
                'Protects against tampering',
                'Chain of custody for compliance'
              ],
              resources: [
                { name: 'Log File Integrity', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html' }
              ]
            }
          ]
        },
        {
          title: 'VPC Flow Logs',
          content: [
            {
              topic: 'Configuration and Analysis',
              details: [
                'Capture at: VPC, Subnet, or ENI level',
                'ACCEPT, REJECT, or ALL traffic',
                'Custom format with 29 available fields',
                'Destinations: S3, CloudWatch Logs, Kinesis Data Firehose',
                'No impact on network performance',
                'Not real-time (aggregation window)',
                'Athena queries for analysis'
              ],
              resources: [
                { name: 'Flow Logs Guide', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html' },
                { name: 'Flow Log Records', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-records-examples.html' }
              ]
            },
            {
              topic: 'Traffic Mirroring',
              details: [
                'Packet-level visibility',
                'Mirror traffic to security appliances',
                'Filter traffic with rules',
                'Source: ENI, Target: ENI or NLB',
                'No impact on source traffic',
                'VXLAN encapsulation',
                'IDS/IPS integration'
              ],
              resources: [
                { name: 'Traffic Mirroring', url: 'https://docs.aws.amazon.com/vpc/latest/mirroring/what-is-traffic-mirroring.html' }
              ]
            }
          ]
        },
        {
          title: 'AWS Config',
          content: [
            {
              topic: 'Configuration Monitoring',
              details: [
                'Configuration history and relationships',
                'Configuration snapshots and delivery',
                'Change notifications via SNS',
                'Config Rules for compliance checking',
                'Auto-remediation with SSM documents',
                'Multi-account aggregation',
                'Conformance packs for standards'
              ],
              resources: [
                { name: 'Config Guide', url: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html' },
                { name: 'Config Rules', url: 'https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html' }
              ]
            },
            {
              topic: 'Advanced Querying',
              details: [
                'SQL-based queries on configuration data',
                'Resource relationships and dependencies',
                'Point-in-time configuration queries',
                'Export to S3 for analysis',
                'Integration with AWS Organizations',
                'Custom rules with Lambda',
                'Proactive evaluation before deployment'
              ],
              resources: [
                { name: 'Advanced Query', url: 'https://docs.aws.amazon.com/config/latest/developerguide/querying-AWS-resources.html' }
              ]
            }
          ]
        }
      ]
    },
    'infrastructure': {
      title: 'Domain 3: Infrastructure Security (20%)',
      sections: [
        {
          title: 'Network Security',
          content: [
            {
              topic: 'Security Groups vs NACLs',
              details: [
                'Security Groups: Stateful, instance-level, allow only',
                'NACLs: Stateless, subnet-level, allow/deny',
                'Evaluation order: NACL → Security Group',
                'Default SG: Deny all inbound, allow all outbound',
                'Default NACL: Allow all traffic',
                'SG chaining for defense in depth',
                'NACL rules evaluated by number (lowest first)'
              ],
              resources: [
                { name: 'Security Groups', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html' },
                { name: 'Network ACLs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html' }
              ]
            },
            {
              topic: 'AWS Network Firewall',
              details: [
                'Managed firewall service for VPC',
                'Stateful and stateless rule groups',
                'IPS/IDS capabilities',
                'Domain filtering and IP reputation',
                'TLS inspection (with certificates)',
                'Integration with Firewall Manager',
                'Logging to S3, CloudWatch, Kinesis'
              ],
              resources: [
                { name: 'Network Firewall', url: 'https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html' }
              ]
            },
            {
              topic: 'PrivateLink and VPC Endpoints',
              details: [
                'Interface endpoints: ENI with private IP',
                'Gateway endpoints: S3 and DynamoDB only',
                'Service endpoints: Access AWS services privately',
                'PrivateLink: Expose services to other VPCs',
                'Endpoint policies for access control',
                'No internet gateway required',
                'Cross-region support with Transit Gateway'
              ],
              resources: [
                { name: 'VPC Endpoints', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html' }
              ]
            }
          ]
        },
        {
          title: 'DDoS Protection',
          content: [
            {
              topic: 'AWS Shield',
              details: [
                'Shield Standard: Automatic, free, L3/L4 protection',
                'Shield Advanced: $3000/month, L3/L4/L7',
                'DDoS Response Team (DRT) access',
                'Cost protection for scaling',
                'Global threat dashboard',
                'Advanced attack diagnostics',
                'Protection for: EC2, ELB, CloudFront, Route 53'
              ],
              resources: [
                { name: 'Shield Guide', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html' },
                { name: 'DDoS Resiliency', url: 'https://d1.awsstatic.com/whitepapers/Security/DDoS_White_Paper.pdf' }
              ]
            },
            {
              topic: 'AWS WAF',
              details: [
                'Web ACLs with rules and rule groups',
                'Rate limiting (per 5 minutes)',
                'IP sets, regex patterns, geo-blocking',
                'SQL injection, XSS protection',
                'Custom rules with conditions',
                'Managed rule groups (AWS and third-party)',
                'Integration: CloudFront, ALB, API Gateway, AppSync'
              ],
              resources: [
                { name: 'WAF Guide', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html' },
                { name: 'WAF Rules', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rules.html' }
              ]
            }
          ]
        },
        {
          title: 'Edge Security',
          content: [
            {
              topic: 'CloudFront Security',
              details: [
                'Origin Access Control (OAC) for S3',
                'Field-level encryption',
                'Signed URLs and cookies',
                'Geo-restriction capabilities',
                'AWS WAF integration',
                'Custom headers for origin verification',
                'TLS 1.2+ enforcement'
              ],
              resources: [
                { name: 'CloudFront Security', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/SecurityAndPrivateContent.html' }
              ]
            }
          ]
        }
      ]
    },
    'iam': {
      title: 'Domain 4: Identity and Access Management (16%)',
      sections: [
        {
          title: 'Advanced IAM Concepts',
          content: [
            {
              topic: 'Policy Evaluation Logic',
              details: [
                'Explicit Deny → Service Control Policies → Permission Boundaries → Session Policies → Identity Policies → Resource Policies',
                'Policy variables: ${aws:username}, ${aws:userid}',
                'Condition keys: StringEquals, IpAddress, DateGreaterThan',
                'NotAction vs Deny differences',
                'Policy simulator for testing',
                'Access Analyzer for external access',
                'Policy validation and suggestions'
              ],
              resources: [
                { name: 'Policy Evaluation', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html' },
                { name: 'Policy Reference', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html' }
              ]
            },
            {
              topic: 'Permission Boundaries',
              details: [
                'Maximum permissions for IAM entity',
                'Cannot grant permissions beyond boundary',
                'Use case: Delegated admin scenarios',
                'Applied to users and roles (not groups)',
                'Intersection of identity and boundary policies',
                'Prevent privilege escalation',
                'Common pattern: Developer self-service'
              ],
              resources: [
                { name: 'Permission Boundaries', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html' }
              ]
            },
            {
              topic: 'Cross-Account Access',
              details: [
                'Trust relationships in role trust policy',
                'External ID for third-party access',
                'Confused deputy problem prevention',
                'AssumeRole with temporary credentials',
                'Session tags for attribute-based access',
                'Role chaining limitations (1 hour max)',
                'AWS Organizations trusted access'
              ],
              resources: [
                { name: 'Cross-Account Roles', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html' }
              ]
            }
          ]
        },
        {
          title: 'Federation and SSO',
          content: [
            {
              topic: 'AWS IAM Identity Center (SSO)',
              details: [
                'Centralized access to multiple AWS accounts',
                'Integration with external IdPs (SAML 2.0)',
                'Permission sets for role mapping',
                'Automatic provisioning with SCIM',
                'MFA enforcement options',
                'Audit with CloudTrail',
                'Application assignments for SAML apps'
              ],
              resources: [
                { name: 'Identity Center Guide', url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html' }
              ]
            },
            {
              topic: 'SAML 2.0 Federation',
              details: [
                'IdP-initiated vs SP-initiated flow',
                'AssumeRoleWithSAML API',
                'SAML assertion attributes mapping',
                'Session duration configuration',
                'Multiple SAML providers per account',
                'Troubleshooting with CloudTrail',
                'Active Directory integration patterns'
              ],
              resources: [
                { name: 'SAML Federation', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_saml.html' }
              ]
            }
          ]
        },
        {
          title: 'Service Control Policies',
          content: [
            {
              topic: 'SCP Concepts',
              details: [
                'Maximum permissions for Organization accounts',
                'Inherit through OU hierarchy',
                'No effect on management account',
                'Deny list vs Allow list strategies',
                'Cannot grant permissions (only restrict)',
                'Affects all identities including root',
                'Common controls: Region restriction, service denial'
              ],  
              resources: [
                { name: 'SCP Guide', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html' },
                { name: 'SCP Examples', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_examples.html' }
              ]
            }
          ]
        }
      ]
    },
    'data-protection': {
      title: 'Domain 5: Data Protection (18%)',
      sections: [
        {
          title: 'AWS KMS',
          content: [
            {
              topic: 'Key Types and Management',
              details: [
                'Customer managed keys (CMK): Full control',
                'AWS managed keys: Automatic rotation',
                'AWS owned keys: No visibility',
                'Symmetric vs Asymmetric keys',
                'Multi-Region keys for disaster recovery',
                'Key policies + IAM policies = access',
                'Envelope encryption with data keys'
              ],
              resources: [
                { name: 'KMS Concepts', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html' },
                { name: 'Key Policies', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html' }
              ]
            },
            {
              topic: 'Key Rotation and Deletion',
              details: [
                'Automatic rotation: Yearly for CMKs',
                'Manual rotation: Any frequency',
                'Rotation keeps same key ID',
                'Key deletion: 7-30 day waiting period',
                'Backing key material retained for decryption',
                'CloudTrail logging for all operations',
                'ViaService condition for service restrictions'
              ],
              resources: [
                { name: 'Key Rotation', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html' }
              ]
            },
            {
              topic: 'Cross-Account Key Sharing',
              details: [
                'Key policy must allow external account',
                'IAM policy in external account for users',
                'Grant tokens for temporary permissions',
                'Encryption context for additional security',
                'CloudHSM integration for compliance',
                'FIPS 140-2 Level 2 (Level 3 with CloudHSM)',
                'Throttling: Shared across regions'
              ],
              resources: [
                { name: 'Cross-Account KMS', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html' }
              ]
            }
          ]
        },
        {
          title: 'S3 Security',
          content: [
            {
              topic: 'Bucket Policies and Encryption',
              details: [
                'Bucket policies: Resource-based, JSON',
                'Block Public Access: Account and bucket level',
                'SSE-S3: AES-256, AWS managed',
                'SSE-KMS: Audit trail, key policies',
                'SSE-C: Customer provided keys',
                'Bucket Keys: Reduce KMS API calls',
                'Default encryption configuration'
              ],
              resources: [
                { name: 'S3 Security Best Practices', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html' },
                { name: 'S3 Encryption', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryption.html' }
              ]
            },
            {
              topic: 'Access Control',
              details: [
                'S3 Object Lock: WORM protection',
                'Retention modes: Governance vs Compliance',
                'Legal hold: Indefinite retention',
                'Access Points: Simplified access management',
                'Multi-Region Access Points',
                'VPC endpoints for private access',
                'S3 Access Analyzer findings'
              ],
              resources: [
                { name: 'S3 Object Lock', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html' }
              ]
            }
          ]
        },
        {
          title: 'Database Security',
          content: [
            {
              topic: 'RDS Security',
              details: [
                'Encryption at rest: Must enable at creation',
                'TDE for SQL Server and Oracle',
                'SSL/TLS in transit (force with parameter groups)',
                'IAM database authentication',
                'VPC security groups for network isolation',
                'Automated backups encrypted if DB encrypted',
                'Cross-region snapshot copy with new KMS key'
              ],
              resources: [
                { name: 'RDS Security', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.html' }
              ]
            },
            {
              topic: 'DynamoDB Security',
              details: [
                'Encryption at rest: Default with AWS owned keys',
                'Point-in-time recovery: 35 days',
                'Fine-grained access control with IAM',
                'VPC endpoints for private access',
                'Streams encryption for change capture',
                'Global tables encryption per region',
                'AWS Backup integration'
              ],
              resources: [
                { name: 'DynamoDB Security', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/security.html' }
              ]
            }
          ]
        },
        {
          title: 'Secrets Management',
          content: [
            {
              topic: 'AWS Secrets Manager',
              details: [
                'Automatic rotation with Lambda',
                'Versioning for secret history',
                'Cross-region replication',
                'Fine-grained access with resource policies',
                'Integration with RDS, Redshift, DocumentDB',
                'CloudTrail logging for audit',
                'Encryption with KMS'
              ],
              resources: [
                { name: 'Secrets Manager', url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html' }
              ]
            }
          ]
        }
      ]
    },
    'governance': {
      title: 'Domain 6: Management and Security Governance (14%)',
      sections: [
        {
          title: 'AWS Organizations',
          content: [
            {
              topic: 'Security Controls',
              details: [
                'Service Control Policies for preventive controls',
                'CloudTrail organization trail',
                'Config aggregators for compliance',
                'Trusted access for AWS services',
                'Delegated administrator accounts',
                'Tag policies for standardization',
                'Backup policies for data protection'
              ],
              resources: [
                { name: 'Organizations Security', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_security.html' },
                { name: 'Best Practices', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_best-practices.html' }
              ]
            }
          ]
        },
        {
          title: 'AWS Control Tower',
          content: [
            {
              topic: 'Guardrails',
              details: [
                'Preventive: Implemented as SCPs',
                'Detective: Implemented as Config rules',
                'Mandatory, Strongly recommended, Elective',
                'Landing Zone with security baseline',
                'Account Factory for provisioning',
                'Guardrail compliance dashboard',
                'Drift detection and remediation'
              ],
              resources: [
                { name: 'Control Tower', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html' },
                { name: 'Guardrails Reference', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/guardrails-reference.html' }
              ]
            }
          ]
        },
        {
          title: 'Compliance Services',
          content: [
            {
              topic: 'AWS Audit Manager',
              details: [
                'Continuous audit evidence collection',
                'Pre-built frameworks: SOC2, PCI-DSS, HIPAA',
                'Custom frameworks support',
                'Automated evidence collection',
                'Assessment reports generation',
                'Integration with Security Hub',
                'Delegation of evidence collection'
              ],
              resources: [
                { name: 'Audit Manager', url: 'https://docs.aws.amazon.com/audit-manager/latest/userguide/what-is.html' }
              ]
            },
            {
              topic: 'AWS Artifact',
              details: [
                'Compliance reports: SOC, PCI, ISO',
                'Agreements: BAA, NDA',
                'Organization agreements management',
                'Report expiration notifications',
                'Restricted access via IAM',
                'Integration with procurement',
                'Evidence for auditors'
              ],
              resources: [
                { name: 'AWS Artifact', url: 'https://docs.aws.amazon.com/artifact/latest/ug/what-is-aws-artifact.html' }
              ]
            }
          ]
        },
        {
          title: 'Cost and Security Optimization',
          content: [
            {
              topic: 'AWS Trusted Advisor',
              details: [
                'Security checks: Open ports, IAM use, MFA',
                'S3 bucket permissions',
                'Security group rules analysis',
                'IAM access key rotation',
                'Exposed access keys detection',
                'CloudTrail logging status',
                'Business/Enterprise support for all checks'
              ],
              resources: [
                { name: 'Trusted Advisor', url: 'https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html' }
              ]
            },
            {
              topic: 'Security Automation',
              details: [
                'AWS Systems Manager for patching',
                'EventBridge for security event response',
                'Lambda for automated remediation',
                'Step Functions for complex workflows',
                'CloudFormation for secure templates',
                'Service Catalog for approved products',
                'AWS Firewall Manager for centralized rules'
              ],
              resources: [
                { name: 'Security Automation', url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/automate-security-scanning.html' }
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
      domain: 'Threat Detection',
      question: 'A security team receives a GuardDuty finding indicating cryptocurrency mining activity on an EC2 instance. What is the MOST appropriate immediate response?',
      options: [
        'Terminate the EC2 instance immediately',
        'Isolate the instance by modifying its security group to deny all traffic',
        'Create a snapshot of the instance for forensics, then isolate it',
        'Increase CloudWatch monitoring on the instance'
      ],
      correct: 2,
      explanation: 'Best practice for incident response is to preserve evidence first by creating a snapshot for forensic analysis, then isolate the instance to prevent further damage while maintaining the ability to investigate.'
    },
    {
      id: 2,
      domain: 'IAM',
      question: 'A company wants to allow developers to create EC2 instances but prevent them from creating instances larger than t3.medium. Which approach should be used?',
      options: [
        'Use IAM policy with Deny effect for instances larger than t3.medium',
        'Apply a permission boundary that limits EC2 instance types',
        'Use Service Control Policy to restrict instance types',
        'Configure AWS Config rule to terminate large instances'
      ],
      correct: 1,
      explanation: 'Permission boundaries are ideal for delegated administration scenarios where you want to set maximum permissions. They can effectively limit the instance types that developers can launch.'
    },
    {
      id: 3,
      domain: 'Data Protection',
      question: 'An organization needs to ensure that all data stored in S3 is encrypted and that only specific KMS keys are used. What is the BEST solution?',
      options: [
        'Enable default encryption on all S3 buckets',
        'Use S3 bucket policies with condition "s3:x-amz-server-side-encryption-aws-kms-key-id"',
        'Configure AWS Config rules to check encryption',
        'Use CloudTrail to monitor unencrypted uploads'
      ],
      correct: 1,
      explanation: 'S3 bucket policies with specific conditions can enforce both encryption and the use of specific KMS keys, preventing any unencrypted uploads or uploads with unauthorized keys.'
    },
    {
      id: 4,
      domain: 'Network Security',
      question: 'A web application behind an ALB is experiencing SQL injection attempts. The security team needs to block these requests. What should they implement?',
      options: [
        'Configure Security Groups to block malicious IPs',
        'Implement AWS WAF with SQL injection rule',
        'Enable AWS Shield Advanced',
        'Use Network ACLs to filter traffic'
      ],
      correct: 1,
      explanation: 'AWS WAF is designed to protect against application layer attacks like SQL injection. It can inspect HTTP/HTTPS requests and block those matching SQL injection patterns.'
    },
    {
      id: 5,
      domain: 'Logging',
      question: 'A company needs to detect when CloudTrail logging is disabled in any account. What is the MOST effective solution?',
      options: [
        'Create a Config rule to check CloudTrail status',
        'Use CloudWatch Events to detect StopLogging API calls',
        'Enable GuardDuty to monitor CloudTrail',
        'Configure Security Hub to aggregate findings'
      ],
      correct: 1,
      explanation: 'CloudWatch Events (EventBridge) can detect the StopLogging API call in real-time and trigger immediate notifications or automated responses, providing the fastest detection.'
    },
    {
      id: 6,
      domain: 'Compliance',
      question: 'An organization must demonstrate compliance with PCI DSS. Which combination of services provides the BEST evidence collection?',
      options: [
        'AWS Config and CloudTrail only',
        'AWS Audit Manager with Security Hub',
        'AWS Artifact and Trusted Advisor',
        'Amazon Inspector and GuardDuty'
      ],
      correct: 1,
      explanation: 'AWS Audit Manager automates evidence collection for compliance frameworks like PCI DSS, while Security Hub provides additional security findings and compliance scores.'
    },
    {
      id: 7,
      domain: 'Infrastructure Security',
      question: 'A company wants to allow private EC2 instances to access S3 without traversing the internet. What should be configured?',
      options: [
        'NAT Gateway with S3 bucket policy',
        'VPC Gateway Endpoint for S3',
        'AWS PrivateLink connection',
        'Direct Connect to S3'
      ],
      correct: 1,
      explanation: 'VPC Gateway Endpoints provide private connectivity to S3 without requiring internet access, NAT gateways, or VPN connections. They\'re specifically designed for S3 and DynamoDB.'
    },
    {
      id: 8,
      domain: 'Identity Management',
      question: 'A third-party SaaS application needs to access resources in an AWS account. The access should be revocable and not use long-term credentials. What should be implemented?',
      options: [
        'Create an IAM user with access keys',
        'Use IAM roles with External ID',
        'Implement SAML federation',
        'Configure AWS SSO'
      ],
      correct: 1,
      explanation: 'IAM roles with External ID provide secure cross-account access for third parties, preventing the confused deputy problem and avoiding long-term credentials.'
    },
    {
      id: 9,
      domain: 'Incident Response',
      question: 'After a security incident, the team needs to analyze VPC network traffic from the past week. However, VPC Flow Logs were not enabled. What service could provide historical network insights?',
      options: [
        'AWS Detective can analyze up to a year of historical data',
        'GuardDuty stores 90 days of network data',
        'CloudTrail contains network flow information',
        'Traffic cannot be analyzed retroactively'
      ],
      correct: 0,
      explanation: 'AWS Detective automatically collects and analyzes VPC Flow Logs data (among other sources) for up to a year, even if you haven\'t explicitly enabled VPC Flow Logs.'
    },
    {
      id: 10,
      domain: 'Key Management',
      question: 'A company needs to share encrypted data between AWS accounts in different regions. What is the BEST approach?',
      options: [
        'Create identical CMKs in each region',
        'Use multi-region KMS keys',
        'Share the CMK via key policy across regions',
        'Export and import key material'
      ],
      correct: 1,
      explanation: 'Multi-region KMS keys can be replicated across regions and allow encrypted data to be decrypted in different regions without re-encryption, ideal for disaster recovery and data residency.'
    }
  ];

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
                  <div key={itemIdx} className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{item.topic}</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                      {item.details.map((detail, detailIdx) => (
                        <li key={detailIdx}>{detail}</li>
                      ))}
                    </ul>
                    {item.resources && (
                      <div className="mt-3 space-y-1">
                        {item.resources.map((resource, resIdx) => (
                          <a
                            key={resIdx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
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
          <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
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
                    : 'border-red-500 bg-red-50'
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
              : 'bg-red-600 text-white hover:bg-red-700'
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
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            <h1 className="text-3xl font-bold">AWS Security Specialty Exam Reference</h1>
          </div>
          <p className="text-red-100">Master advanced security concepts for the SCS-C02 exam</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-1 mb-6">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-red-600 text-white' 
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
                  ? 'bg-red-600 text-white' 
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
                  ? 'bg-red-600 text-white' 
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
                  ? 'bg-red-600 text-white' 
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
                    <li>• Exam Code: SCS-C02</li>
                    <li>• Duration: 170 minutes</li>
                    <li>• Questions: 65 (scenario-based and multiple choice)</li>
                    <li>• Passing Score: 750/1000</li>
                    <li>• Cost: $300 USD</li>
                    <li>• Prerequisites: Associate-level certification recommended</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Required Experience</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 5+ years IT security experience</li>
                    <li>• 2+ years hands-on AWS security</li>
                    <li>• Security controls for workloads on AWS</li>
                    <li>• Incident response experience</li>
                    <li>• Understanding of security threats</li>
                    <li>• Compliance and governance knowledge</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Exam Domains</h2>
              <div className="space-y-3">
                {examDomains.map((domain, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <domain.icon className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-gray-800">{domain.name}</span>
                    </div>
                    <span className="text-red-600 font-semibold">{domain.weight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-semibold text-red-900 mb-2">Security Specialty Focus Areas</h3>
              <ul className="space-y-2 text-red-800">
                <li>• Advanced IAM concepts: Permission boundaries, cross-account access, federation</li>
                <li>• Security services deep dive: GuardDuty, Security Hub, Detective, Macie</li>
                <li>• Encryption everywhere: KMS, CloudHSM, TLS, S3, database encryption</li>
                <li>• Network security: VPC security, WAF, Shield, Network Firewall</li>
                <li>• Incident response: Forensics, isolation, automation</li>
                <li>• Compliance: Frameworks, audit trails, evidence collection</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTab === 'cheatsheet' && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">
                🛡️ <strong>Security First:</strong> This exam tests deep security knowledge. Focus on defense-in-depth, least privilege, and automated response patterns.
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
              <p className="text-gray-600">Advanced scenario-based questions testing real-world security knowledge.</p>
            </div>
            {practiceQuestions.map(question => renderQuestion(question))}
          </div>
        )}
        
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Essential Security Resources</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Official AWS Resources</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://aws.amazon.com/certification/certified-security-specialty/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        AWS Certified Security - Specialty
                      </a>
                    </li>
                    <li>
                      <a href="https://d1.awsstatic.com/training-and-certification/docs-security-spec/AWS-Certified-Security-Specialty_Exam-Guide.pdf" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Exam Guide (PDF)
                      </a>
                    </li>
                    <li>
                      <a href="https://d1.awsstatic.com/training-and-certification/docs-security-spec/AWS-Certified-Security-Specialty_Sample-Questions.pdf" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Sample Questions (PDF)
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Security Documentation</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Security Pillar - Well-Architected Framework
                      </a>
                    </li>
                    <li>
                      <a href="https://aws.amazon.com/architecture/security-identity-compliance/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Security Reference Architecture
                      </a>
                    </li>
                    <li>
                      <a href="https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture/welcome.html" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        AWS Security Reference Architecture (SRA)
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Security Best Practices</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://d1.awsstatic.com/whitepapers/aws-security-best-practices.pdf" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        AWS Security Best Practices Whitepaper
                      </a>
                    </li>
                    <li>
                      <a href="https://d1.awsstatic.com/whitepapers/Security/AWS_Security_Incident_Response_Guide.pdf" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        AWS Security Incident Response Guide
                      </a>
                    </li>
                    <li>
                      <a href="https://aws.amazon.com/blogs/security/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        AWS Security Blog
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Hands-On Security Labs</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="https://www.wellarchitectedlabs.com/security/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Well-Architected Security Labs
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/aws-samples/aws-security-workshops" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        AWS Security Workshops
                      </a>
                    </li>
                    <li>
                      <a href="https://aws.amazon.com/security/security-learning/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Security Learning Resources
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Preparation Tips</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2 text-gray-700">
                      <li>• Build multi-account security architectures hands-on</li>
                      <li>• Practice incident response scenarios</li>
                      <li>• Deep dive into KMS key policies and encryption</li>
                      <li>• Master IAM policy evaluation logic</li>
                      <li>• Understand all security services and their integrations</li>
                      <li>• Review compliance frameworks and audit procedures</li>
                      <li>• Practice with security automation and remediation</li>
                      <li>• Study network security patterns and DDoS mitigation</li>
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

export default AWSSecuritySpecialtyApp;
