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
    { name: 'Monitoring, Logging, Analysis, Remediation, and Performance Optimization', weight: '22%' },
    { name: 'Reliability and Business Continuity', weight: '22%' },
    { name: 'Deployment, Provisioning, and Automation', weight: '22%' },
    { name: 'Security and Compliance', weight: '16%' },
    { name: 'Networking and Content Delivery', weight: '18%' }
]

const cheatsheet = {
  monitoring: {
    title: 'Domain 1: Monitoring, Logging, Analysis, Remediation, and Performance Optimization (22%)',
    sections: [
      {
        title: 'CloudWatch Core (Metrics, Alarms, Dashboards, Agent, SNS)',
        content: [
          {
            topic: 'CloudWatch Metrics',
            details: [
              'Default EC2 metrics: CPU, network in/out, disk I/O (no memory or disk space by default).',
              'Custom metrics via PutMetricData API or CloudWatch agent (e.g., memory, disk usage, application metrics).',
              {
                name: 'CLI Example',
                text: 'Use `aws cloudwatch put-metric-data --namespace "MyApp" --metric-name "ProcessedOrders" --value 1` to push a custom metric.'
              },
              'Metric math for aggregations and calculations across metrics (averages, percentages, ratios).',
              {
                name: 'Examples',
                text: 'Example 1: `(m1 + m2) / 2` to compute an average across two Auto Scaling groups. Example 2: metric math expression `SEARCH({AWS/EC2,CPUUtilization},"InstanceId","Average",300)` to select specific instances by dimension.'
              },
              'High-resolution metrics (up to 1-second granularity) for fine-grained alarms and analysis.',
              {
                name: 'Examples',
                text: 'High-resolution alarm for `p99` latency on a critical API; set period to `10` seconds with `Standard` statistics to capture spiky workloads.'
              },
              'Retention: 15 months with automatic aggregation (1-minute, 5-minute, 1-hour periods). Important for questions about historical trend analysis and capacity planning.'
            ],
            resources: [
              { name: 'CloudWatch Metrics Guide', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html' }
            ]
          },
          {
            topic: 'CloudWatch Alarms',
            details: [
              'Alarm States: OK, ALARM, INSUFFICIENT_DATA.',
              'Actions can directly invoke AWS services: SNS notifications, Auto Scaling policies, EC2 stop/terminate/recover/reboot, Systems Manager actions.',
              {
                name: 'Exam Pattern',
                text: 'CPU > 80% for 5 minutes triggers an Auto Scaling step or target tracking policy to add capacity.'
              },
              'Composite alarms: combine multiple alarms with AND/OR logic to reduce alarm noise and implement “only page when multiple signals fail”.',
              'Anomaly detection: ML-based dynamic thresholds instead of static values.',
              {
                name: 'Example',
                text: 'Detect abnormal surges in `5XXError` rate on an ALB without guessing a static threshold.'
              },
              'Can target EventBridge to fan out events to Lambda, SSM Automation, or other services for remediation.',
              {
                name: 'Pattern',
                text: 'CloudWatch alarm -> EventBridge rule -> Lambda or SSM Automation runbook to perform auto-remediation (e.g., restart instance, resize, rotate, or collect diagnostics).'
              },
              'Billing alarms are created in `us-east-1` (N. Virginia) only.',
              {
                name: 'Exam Gotcha',
                text: 'If a question mentions “cannot find billing metrics” in another Region, the answer usually involves switching to us-east-1 to configure the billing alarm.'
              }
            ],
            resources: [
              { name: 'CloudWatch Alarms', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html' }
            ]
          },
          {
            topic: 'CloudWatch Logs',
            details: [
              'Organized as log groups (applications/components) and log streams (instance/container/process).',
              'Configurable retention from 1 day to 10 years or “never expire”.',
              'Metric filters convert log patterns (e.g., `ERROR`, `5xx`) into CloudWatch metrics for alarms.',
              {
                name: 'Example',
                text: 'Create a metric filter on `ERROR` in an application log group and alarm when error count exceeds a threshold in 5 minutes.'
              },
              'CloudWatch Logs Insights provides a query language to analyze logs at scale (filtering, aggregation, and visualization).',
              {
                name: 'Query Example',
                text: 'Use `fields @timestamp, @message | filter status >= 500 | stats count() by bin(5m)` to find spikes in HTTP 5xx responses over time.'
              },
              'Logs can be exported to S3 for long-term storage and analytics (up to 12-hour delay).',
              'Supports real-time subscription filters to Kinesis/Lambda/Firehose for streaming processing and near real-time analytics.'
            ],
            resources: [
              { name: 'CloudWatch Logs', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html' }
            ]
          },
          {
            topic: 'CloudWatch Agent & Container Metrics',
            details: [
              'CloudWatch agent installs on EC2, on-premises servers, and container hosts (ECS/EKS nodes) to collect OS-level metrics and logs.',
              'Used to collect memory, disk space, processes, swap usage, and application logs that are NOT available as default EC2 metrics.',
              'Configuration via JSON/TOML file; can be stored in Systems Manager Parameter Store for central management.',
              {
                name: 'CLI Example',
                text: 'Store CloudWatch agent config JSON in Parameter Store and reference it with `amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c ssm:parameter-name`.'
              },
              'Deployed and updated at scale using Systems Manager Distributor and Run Command.',
              'For ECS/EKS, use CloudWatch agent or AWS Distro for OpenTelemetry (ADOT) to send container-level metrics to CloudWatch or Prometheus backends.'
            ],
            resources: [
              { name: 'CloudWatch Agent', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html' }
            ]
          },
          {
            topic: 'CloudWatch Dashboards',
            details: [
              'Customizable and shareable dashboards to visualize metrics, alarms, and logs across AWS resources.',
              'Dashboards can include widgets from multiple services, Regions, and accounts (via cross-account data).',
              'Common widgets: time series graphs, single-value metrics, text widgets, and alarm status widgets.',
              'Useful for exam scenarios about “single pane of glass” monitoring for operations teams.',
              'Dashboards are global (not bound to a Region) and billed per dashboard per month after the free tier.',
              'Ideal to display KPIs for EC2, RDS, EKS, S3, and application-specific metrics in a single view.'
            ],
            resources: [
              { name: 'CloudWatch Dashboards', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html' }
            ]
          },
          {
            topic: 'Notifications & Amazon SNS Integration',
            details: [
              'CloudWatch alarms commonly publish to Amazon SNS topics to send email/SMS/HTTP notifications or trigger Lambda/other subscribers.',
              'SNS provides fan-out so one alarm can notify multiple subscribers (e.g., email, chat, Lambda, incident management tools).',
              'SNS + CloudWatch alarms can integrate with AWS User Notifications to surface alerts in the console and mobile app.',
              {
                name: 'Exam Pattern',
                text: 'Typical question: “When CPU > 80% for 5 minutes, send an email to Ops and trigger a Lambda function to scale another service.” Solution: CloudWatch alarm -> SNS topic -> email + Lambda subscription.'
              }
            ],
            resources: [
              { name: 'Amazon SNS', url: 'https://docs.aws.amazon.com/sns/latest/dg/welcome.html' }
            ]
          }
        ]
      },
      {
        title: 'Logging, Audit, and CloudTrail',
        content: [
          {
            topic: 'CloudWatch Logs',
            details: [
              'Organized as log groups (applications/components) and log streams (instance/container/process).',
              'Configurable retention from 1 day to 10 years or “never expire”.',
              'Metric filters convert log patterns (e.g., `ERROR`, `5xx`) into CloudWatch metrics for alarms.',
              {
                name: 'Example',
                text: 'Create a metric filter on `"[status_code] >= 500"` to track HTTP 5xx errors and drive an alarm when errors exceed a threshold.'
              },
              'CloudWatch Logs Insights provides a query language to analyze logs at scale (filtering, aggregation, and visualization).',
              {
                name: 'Query Example',
                text: 'Use `stats avg(latency) by bin(1m)` to view average latency over time and find performance regressions.'
              },
              'Logs can be exported to S3 for long-term storage and analytics (up to 12-hour delay).',
              'Supports real-time subscription filters to Kinesis/Lambda/Firehose for streaming processing.'
            ],
            resources: [
              { name: 'CloudWatch Logs', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html' }
            ]
          },
          {
            topic: 'AWS CloudTrail',
            details: [
              'Records API calls and console actions for governance, compliance, and forensic analysis.',
              'Management events (control plane) and data events (S3 object-level, Lambda function-level) can be logged.',
              'Trails deliver logs to S3; optional integration with CloudWatch Logs for real-time alerting.',
              {
                name: 'Example',
                text: 'Send CloudTrail logs to CloudWatch Logs, add a metric filter for `ConsoleLogin` failures, and trigger an alarm when failures spike.'
              },
              'CloudTrail Insights identifies unusual API patterns (e.g., spikes in failed logins or IAM changes).',
              'Common exam use: “Who did X and when?” or “Detect unauthorized changes in production accounts.”'
            ],
            resources: [
              { name: 'CloudTrail', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html' }
            ]
          }
        ]
      },
      {
        title: 'AWS Systems Manager & Automation (for Remediation)',
        content: [
          {
            topic: 'SSM Agent & Session Manager',
            details: [
              'SSM Agent is pre-installed on many Amazon Linux and Windows AMIs; required for Systems Manager operations.',
              'Session Manager gives browser/CLI-based shell access without SSH keys, bastion hosts, or opening inbound ports.',
              'Session logs can be sent to S3 and CloudWatch Logs for audit/compliance.',
              'Access controlled via IAM policies, enabling fine-grained least-privilege access to instances.',
              {
                name: 'Exam Pattern',
                text: 'If the requirement says “no inbound ports, no SSH, centralized auditing of commands,” the answer is almost always Session Manager.'
              }
            ],
            resources: [
              { name: 'Session Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html' }
            ]
          },
          {
            topic: 'Parameter Store',
            details: [
              'Secure, hierarchical storage for configuration values and secrets (plaintext or encrypted with KMS).',
              'Standard parameters (up to 4 KB) are free with no advanced features; advanced parameters (up to 8 KB) support policies and higher throughput (extra cost).',
              'Versioned parameters with history; can roll back to previous versions if needed.',
              'Integrates with CloudFormation, Lambda, EC2 User Data, and many AWS services for centralized configuration.',
              {
                name: 'Exam Pattern',
                text: 'Typical scenario: “Securely store DB passwords and rotate with KMS encryption and IAM-based access; avoid hardcoding in User Data.” Answer: SSM Parameter Store (or Secrets Manager in Security domain).'
              }
            ],
            resources: [
              { name: 'Parameter Store', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html' }
            ]
          },
          {
            topic: 'Patch Manager',
            details: [
              'Automates OS and application patching across EC2, on-premises servers, and hybrid environments.',
              'Uses patch baselines (AWS managed or custom) to define which patches are approved.',
              'Maintenance Windows schedule when patching can occur to reduce impact.',
              'Patch groups (via tags) to target specific environments (e.g., dev, test, prod).',
              'Provides compliance reports showing which instances are missing patches (important for audit/compliance questions).'
            ],
            resources: [
              { name: 'Patch Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html' }
            ]
          },
          {
            topic: 'Automation Runbooks & Incident Response',
            details: [
              'Systems Manager Automation runbooks define multi-step workflows (e.g., restart instance, collect logs, patch, rollback).',
              'Supports AWS-provided and custom runbooks; can be triggered manually, on a schedule, or via EventBridge/Lambda/SDK.',
              {
                name: 'Pattern',
                text: 'CloudWatch alarm -> EventBridge rule -> SSM Automation runbook to perform auto-remediation (restart service, detach volume, change instance type, gather diagnostics).'
              },
              'Supports approvals, rate control, and rollback steps for safer operations.',
              'Maps directly to Skill 1.2.3: create/run custom and predefined automation runbooks to streamline processes.'
            ],
            resources: [
              { name: 'Systems Manager Automation', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html' }
            ]
          }
        ]
      },
      {
        title: 'EventBridge (CloudWatch Events) – Event Routing & Remediation',
        content: [
          {
            topic: 'Event Patterns & Rules',
            details: [
              'Event sources: AWS services, custom applications, and SaaS partners.',
              'Event patterns match on `detail-type`, `source`, and fields in the event; schedules (`rate`/`cron`) create time-based events.',
              'Targets: Lambda, SQS, SNS, Step Functions, Systems Manager Automation, Kinesis, ECS tasks, and more.',
              'Event buses: default, custom, and partner buses support multi-account and SaaS integration.',
              'Event replay and archive allow you to store and reprocess events for testing or recovery.',
              'Troubleshooting rules: check rule matching (pattern vs. event), target permissions (IAM), and DLQs for failed invocations.',
              {
                name: 'Exam Mapping',
                text: 'Directly maps to Skill 1.2.2: use EventBridge to route, enrich, and deliver events and troubleshoot event bus rules.'
              }
            ],
            resources: [
              { name: 'EventBridge', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/what-is-amazon-eventbridge.html' }
            ]
          }
        ]
      },
      {
        title: 'Performance & Cost Optimization (Compute, Storage, Database)',
        content: [
          {
            topic: 'Compute Optimization',
            details: [
              'Right-size EC2 using CPU/memory/network metrics and Compute Optimizer recommendations.',
              'Use Auto Scaling (target tracking, step, scheduled) to match capacity to demand and improve cost-efficiency.',
              'Prefer modern instance families (e.g., `M6g`, `C7g`) and Savings Plans/Reserved Instances for steady workloads.',
              'Tag resources by environment, application, and owner to drive cost and performance reporting.',
              'Consider Spot Instances for interruptible workloads to reduce cost significantly.',
              {
                name: 'Exam Mapping',
                text: 'Ties to Skill 1.3.1 and 1.3.6 for optimizing compute resources and EC2 performance (including Auto Scaling and placement strategies).'
              }
            ],
            resources: [
              { name: 'Compute Optimizer', url: 'https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is.html' }
            ]
          },
          {
            topic: 'EBS Performance & Volume Types',
            details: [
              'General Purpose SSD (`gp3`/`gp2`) for balanced workloads; `gp3` lets you provision IOPS and throughput independently of size.',
              'Provisioned IOPS SSD (`io1`/`io2`) for latency-sensitive and high-IOPS workloads (typically databases).',
              'Monitor key metrics: `VolumeReadOps`, `VolumeWriteOps`, `VolumeQueueLength`, and `BurstBalance` for burstable volumes.',
              'Use EBS-optimized instances and appropriate block size to improve performance.',
              'Resize volumes or switch types (e.g., `gp2` → `gp3`, `gp3` → `io2`) to fix bottlenecks and/or reduce cost.',
              {
                name: 'Exam Mapping',
                text: 'Maps to Skill 1.3.2: analyze EBS metrics, troubleshoot performance issues, and optimize volume types.'
              }
            ],
            resources: [
              { name: 'EBS Performance', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimizing.html' }
            ]
          },
          {
            topic: 'S3 Performance & Data Transfer',
            details: [
              'Multipart uploads improve throughput for large objects and resilience to network issues.',
              'S3 Transfer Acceleration uses optimized edge network paths to speed up uploads over long distances.',
              'AWS DataSync accelerates data movement between on-premises, S3, EFS, and FSx with built-in encryption and verification.',
              'Use S3 Lifecycle policies and Intelligent-Tiering to optimize storage costs while maintaining access patterns.',
              'Request parallelization and prefix randomization are less critical now due to modern S3 scaling, but may still appear in exam questions.',
              {
                name: 'Exam Mapping',
                text: 'Maps to Skill 1.3.3: implement and optimize S3 performance strategies for data transfer, storage efficiency, and access patterns.'
              }
            ],
            resources: [
              { name: 'S3 Performance', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html' }
            ]
          },
          {
            topic: 'Shared Storage – EFS & FSx',
            details: [
              'Amazon EFS: managed NFS for Linux instances and containers, scales automatically with usage.',
              'Performance modes: General Purpose (low latency) vs. Max I/O (higher throughput for many clients).',
              'Throughput modes: Bursting and Provisioned Throughput for predictable performance.',
              'Lifecycle policies move infrequently accessed files to lower-cost storage classes (e.g., EFS Infrequent Access).',
              'Amazon FSx provides managed file systems for specific workloads (e.g., FSx for Windows, FSx for Lustre).',
              {
                name: 'Exam Mapping',
                text: 'Maps to Skill 1.3.4: evaluate and optimize shared storage solutions (EFS/FSx) for specific use cases.'
              }
            ],
            resources: [
              { name: 'EFS', url: 'https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html' }
            ]
          },
          {
            topic: 'RDS Performance Insights & RDS Proxy',
            details: [
              'Performance Insights provides database load visualization (`DBLoad`), top SQL, wait events, and helps find bottlenecks quickly.',
              'You can create CloudWatch alarms on Performance Insights metrics for proactive detection.',
              'RDS Proxy pools and reuses database connections for serverless and highly concurrent applications, reducing DB overhead.',
              'Use CloudWatch metrics (`CPUUtilization`, `FreeableMemory`, `ReadIOPS`/`WriteIOPS`, `DatabaseConnections`) plus Performance Insights to decide when to scale or tune.',
              {
                name: 'Exam Mapping',
                text: 'Maps to Skill 1.3.5: monitor RDS metrics and modify configuration (including RDS Proxy) for performance efficiency.'
              }
            ],
            resources: [
              { name: 'RDS Performance Insights', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.html' }
            ]
          },
          {
            topic: 'EC2 Networking & Placement Groups',
            details: [
              'Placement groups: Cluster (low-latency, high throughput between instances), Spread (isolate instances across hardware), and Partition (for large, distributed workloads).',
              'Use enhanced networking (ENA, SR-IOV) and appropriate instance families for network-intensive workloads.',
              'Monitor `NetworkIn`/`NetworkOut`, `NetworkPacketsIn`/`NetworkPacketsOut`, and CPU credits (for T-family instances) to identify bottlenecks.',
              {
                name: 'Exam Mapping',
                text: 'Fits into Skill 1.3.6: optimize EC2 instances and their associated storage and networking capabilities, including placement strategy choices.'
              }
            ],
            resources: [
              { name: 'Placement Groups', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html' }
            ]
          }
        ]
      },
      {
        title: 'Container & Prometheus Monitoring',
        content: [
          {
            topic: 'Amazon Managed Service for Prometheus (AMP)',
            details: [
              'Fully managed, Prometheus-compatible monitoring service for container workloads (EKS/ECS/self-managed Kubernetes).',
              'Scrapes and stores Prometheus metrics; you query using PromQL (Prometheus Query Language).',
              'Integrates with AWS Distro for OpenTelemetry (ADOT) agents/collectors running in your clusters.',
              {
                name: 'Exam Pattern',
                text: 'If the question mentions “Prometheus metrics at scale for EKS” or “managed Prometheus backend”, the correct service is Amazon Managed Service for Prometheus.'
              }
            ],
            resources: [
              { name: 'Amazon Managed Service for Prometheus', url: 'https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html' }
            ]
          },
          {
            topic: 'Amazon Managed Grafana (Context for Dashboards)',
            details: [
              'Managed Grafana workspaces for building dashboards across CloudWatch, Prometheus, X-Ray, and more.',
              'Often paired with AMP to visualize container metrics and application SLOs.',
              {
                name: 'Exam Pattern',
                text: 'Recognize diagrams where Grafana sits on top of AMP/CloudWatch/X-Ray for “central dashboards across multiple accounts and data sources”.'
              }
            ],
            resources: [
              { name: 'Amazon Managed Grafana', url: 'https://docs.aws.amazon.com/grafana/latest/userguide/what-is-AMG.html' }
            ]
          }
        ]
      },
      {
        title: 'Cost Management',
        content: [
          {
            topic: 'EC2 Purchasing Options',
            details: [
              'On-Demand: pay per second/hour, flexible but most expensive.',
              'Reserved Instances: 1–3 years, up to ~72% discount for predictable workloads.',
              'Spot Instances: up to ~90% discount, can be interrupted; best for fault-tolerant and flexible jobs.',
              'Savings Plans: flexible, hourly commitment across instance families/Regions (compute or EC2 types).',
              'Dedicated Hosts: physical server visibility for compliance/licensing.',
              'Dedicated Instances: hardware isolation without host visibility.'
            ],
            resources: [
              { name: 'EC2 Pricing', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html' }
            ]
          },
          {
            topic: 'Cost Monitoring',
            details: [
              'Cost Explorer: visualize historical and forecasted spending.',
              'AWS Budgets: alerts for cost and usage thresholds via email/SNS.',
              'Cost Allocation Tags: track spend by project, team, environment.',
              'Reserved Instance and Savings Plans recommendations for long-running workloads.',
              'Trusted Advisor: cost optimization checks (idle resources, underutilized instances, low-utilization RIs).',
              'S3 Storage Classes and Lifecycle policies to move data to cheaper tiers over time.'
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
              'Right-sizing: match instance family and size to workload based on utilization metrics.',
              'Use Compute Optimizer recommendations to adjust instance types and sizes.',
              'Burstable instances (T3/T4g) for workloads with low baseline and occasional bursts.',
              'Instance store for temporary or cache data with high I/O needs (not durable).',
              'Placement groups for high network performance where low-latency communication is critical.',
              'Enhanced networking (SR-IOV/ENA) for high-throughput, low-latency networking.'
            ],
            resources: [
              { name: 'Compute Optimizer', url: 'https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is.html' }
            ]
          },
          {
            topic: 'Storage Optimization',
            details: [
              'EBS: gp3 for balanced cost/performance and tunable IOPS/throughput.',
              'EBS-optimized instances improve performance and reduce contention.',
              'S3 Transfer Acceleration to speed up long-distance uploads.',
              'S3 Intelligent-Tiering to automatically move objects between access tiers based on usage.',
              'EFS performance modes (General Purpose vs. Max I/O) chosen based on latency vs. throughput needs.',
              'CloudFront for caching static and dynamic content closer to users to reduce latency and offload origins.'
            ],
            resources: [
              { name: 'EBS Optimization', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html' }
            ]
          }
        ]
      }
    ]
  },
    'reliability': {
      title: 'Domain 2: Reliability and Business Continuity (22%)',
      sections: [
        {
          title: 'Scalability & Elasticity (Auto Scaling & Caching)',
          content: [
            {
              topic: 'EC2 Auto Scaling',
              details: [
                'Key policies: target tracking, step scaling, scheduled scaling, and predictive scaling.',
                'Target tracking keeps a metric (for example, `ASGAverageCPUUtilization` at 50%) similar to a thermostat.',
                {
                  name: 'Example',
                  text: 'Target tracking policy maintaining `ASGAverageCPUUtilization` at 50% with a scale-out cooldown of 300 seconds to avoid flapping.'
                },
                'Step scaling adds or removes different numbers of instances based on how far a metric breaches the threshold.',
                {
                  name: 'Exam Pattern',
                  text: 'If the question mentions different actions for different CPU thresholds (for example, 60%, 75%, 90%), the correct answer is step scaling, not target tracking.'
                },
                'Scheduled scaling preloads or reduces capacity for predictable traffic (for example, business hours or planned marketing events).',
                'Predictive scaling uses machine learning to forecast demand and scale EC2 capacity ahead of time based on historical patterns.',
                'Cooldown and warm-up settings are used to prevent rapid scale-in and scale-out cycles.',
                'Lifecycle hooks allow custom actions when instances enter `Pending` or `Terminating` (for example, configuration scripts, deregistration, draining connections).',
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skill 2.1.1: configure and manage scaling mechanisms in compute environments (Auto Scaling groups).'
                }
              ],
              resources: [
                { name: 'EC2 Auto Scaling', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html' }
              ]
            },
            {
              topic: 'Application Auto Scaling',
              details: [
                'Application Auto Scaling is used for scalable AWS services other than EC2 Auto Scaling groups.',
                'Common scalable targets include DynamoDB read and write capacity, ECS service desired count, Aurora replica count, EMR clusters, AppStream fleets, and custom resources via API.',
                {
                  name: 'Example',
                  text: 'A DynamoDB table scales between 5 and 1000 `WriteCapacityUnits` based on the `ConsumedWriteCapacityUnits` metric, targeting 70% utilization.'
                },
                'Scaling policies are similar to EC2 Auto Scaling: target tracking and step scaling are supported for many services.',
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skills 2.1.1 and 2.1.3: configure scaling for compute-like services (for example, ECS) and managed databases (for example, DynamoDB, Aurora read replicas).'
                }
              ],
              resources: [
                { name: 'Application Auto Scaling', url: 'https://docs.aws.amazon.com/autoscaling/application/userguide/what-is-application-auto-scaling.html' }
              ]
            },
            {
              topic: 'Caching for Dynamic Scalability (CloudFront & ElastiCache)',
              details: [
                'CloudFront caches static and dynamic content at edge locations to offload origin services (for example, ALB, EC2, S3) and reduce latency.',
                {
                  name: 'Example',
                  text: 'Cache dynamic API responses for 60 seconds at CloudFront edge locations to reduce load on an ALB and EC2 fleet during a flash sale.'
                },
                'ElastiCache (Redis and Memcached) stores frequently accessed data in memory to offload read traffic from databases and APIs.',
                {
                  name: 'Pattern',
                  text: 'Use Redis as a read-through cache for hot items with a time to live (TTL); on cache miss, read from the database, then store in the cache, protecting the database during traffic spikes.'
                },
                'Caching improves scalability by reducing the number of backend calls and can improve resilience during short bursts of high demand.',
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skill 2.1.2: implement caching by using CloudFront and Amazon ElastiCache to enhance dynamic scalability.'
                }
              ],
              resources: [
                { name: 'CloudFront Overview', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html' },
                { name: 'Amazon ElastiCache', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html' }
              ]
            },
            {
              topic: 'Scaling Managed Databases',
              details: [
                'RDS: vertical scaling by changing instance class and horizontal read scaling through read replicas (for supported engines), plus Multi-AZ for high availability.',
                {
                  name: 'Example',
                  text: 'Scale an RDS instance from `db.m6g.large` to `db.m6g.2xlarge` for CPU constraints, and add two read replicas to handle read-heavy workloads.'
                },
                'Aurora separates compute and storage, with storage automatically scaling and up to 15 read replicas in a cluster.',
                'Aurora Global Database supports cross-Region read replicas with low replication lag and fast failover for DR.',
                'DynamoDB supports provisioned capacity with auto scaling and on-demand capacity mode for unpredictable workloads.',
                {
                  name: 'Exam Pattern',
                  text: 'If a question mentions unpredictable traffic and a requirement to avoid managing capacity, the correct answer is DynamoDB on-demand rather than provisioned capacity with auto scaling.'
                },
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skill 2.1.3: configure and manage scaling in managed databases such as RDS, Aurora, and DynamoDB.'
                }
              ],
              resources: [
                { name: 'RDS Scaling', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.DBInstance.html' },
                { name: 'DynamoDB Scaling', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html' }
              ]
            }
          ]
        },
        {
          title: 'High Availability & Fault Tolerance (ELB, Route 53, Multi-AZ)',
          content: [
            {
              topic: 'Elastic Load Balancing & Health Checks',
              details: [
                'ALB and NLB distribute traffic across healthy targets in one or more Availability Zones.',
                'Health checks define which targets receive traffic based on path, port, protocol, success codes, thresholds, and intervals.',
                {
                  name: 'Example',
                  text: 'An ALB health check on `/health` with five second intervals, two healthy and five unhealthy thresholds to fail fast and recover quickly.'
                },
                'Cross-zone load balancing distributes traffic evenly across all registered targets in all enabled AZs.',
                {
                  name: 'Exam Pattern',
                  text: 'If one AZ has more instances than another and cross-zone load balancing is disabled, NLB sends more traffic to the AZ with more instances. To balance traffic, enable cross-zone load balancing or even out instance counts.'
                },
                'Connection draining or deregistration delay allows in-flight requests to complete before removing a target from service.',
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skill 2.2.1: configure and troubleshoot ELB health checks and their impact on high availability.'
                }
              ],
              resources: [
                { name: 'Elastic Load Balancing', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html' }
              ]
            },
            {
              topic: 'Route 53 Health Checks & Routing Policies',
              details: [
                'Route 53 health checks monitor endpoints (HTTP, HTTPS, TCP) or CloudWatch alarms and can be associated with DNS records for failover.',
                'Routing policies include simple, weighted, latency-based, failover, geolocation, geoproximity, and multivalue answer.',
                {
                  name: 'Pattern',
                  text: 'Use failover routing with primary and secondary records. When the primary health check fails, Route 53 returns the secondary record, such as a DR Region.'
                },
                'Health checks can monitor CloudWatch alarms to base DNS decisions on higher-level metrics (for example, ALB 5xx rate).',
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skill 2.2.1 and 2.2.2: combine Route 53 health checks and routing policies with Multi-AZ or multi-Region architectures for resilient endpoints.'
                }
              ],
              resources: [
                { name: 'Route 53 Health Checks', url: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html' }
              ]
            },
            {
              topic: 'Multi-AZ and Multi-Region Architectures',
              details: [
                'RDS Multi-AZ uses synchronous replication to a standby instance in another AZ and performs automatic failover on primary failure.',
                {
                  name: 'Example',
                  text: 'RDS Multi-AZ failover from `us-east-1a` to `us-east-1b` creates a new primary; applications must reconnect using the same endpoint.'
                },
                'Aurora replicates six copies of data across three AZs; a reader endpoint load-balances read replicas while a writer endpoint handles writes.',
                'EFS and S3 are designed for high availability and durability within a Region by storing data across multiple AZs.',
                'Multi-Region architectures often use Route 53 global DNS with health checks, data replication (for example, Aurora Global Database, DynamoDB global tables, S3 cross-Region replication), and runbooks for failover.',
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skill 2.2.2: configure fault-tolerant systems using Multi-AZ and multi-Region patterns when RTO and RPO requirements are strict.'
                }
              ],
              resources: [
                { name: 'RDS Multi-AZ', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html' },
                { name: 'Aurora High Availability', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html' }
              ]
            }
          ]
        },
        {
          title: 'Backup, Restore, and Versioning',
          content: [
            {
              topic: 'AWS Backup and Snapshots',
              details: [
                'AWS Backup centralizes backup policies and backup vaults for services such as EC2, EBS, RDS, DynamoDB, EFS, and FSx.',
                {
                  name: 'Example',
                  text: 'Create a backup plan with daily backups retained for 35 days and monthly backups retained for 12 months for all resources tagged `Environment=Prod`.'
                },
                'EBS snapshots are incremental and stored in S3. They can be copied across Regions and accounts for DR and compliance.',
                'AMI creation for EC2 instances uses EBS snapshots under the hood to capture root and data volumes.',
                'RDS automated backups retain from 1 to 35 days and support point-in-time restore to any second within the retention window.',
                'DynamoDB point-in-time recovery (PITR) restores a table to any second in the last 35 days without affecting the existing table.',
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skill 2.3.1: automate snapshots and backups for EC2, RDS, EBS, S3, and DynamoDB by using AWS Backup and native service features.'
                }
              ],
              resources: [
                { name: 'AWS Backup', url: 'https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html' }
              ]
            },
            {
              topic: 'Database Restore Methods and RTO/RPO',
              details: [
                'RDS restores create a new DB instance from an automated backup or a snapshot; the original instance remains unchanged.',
                'PITR for RDS and DynamoDB is commonly used to recover from logical corruption, such as bad deployments or accidental deletes.',
                {
                  name: 'Example',
                  text: 'Recover a DynamoDB table to its state 10 minutes before a faulty batch job using PITR, then export or copy only the needed data.'
                },
                'Aurora supports fast cloning and Aurora MySQL supports backtrack to rewind data to a prior time without a full restore.',
                {
                  name: 'Exam Pattern',
                  text: 'If a question mentions rolling back an Aurora MySQL database to a point a few hours ago without creating a new cluster, the correct answer is Aurora Backtrack, not snapshot restore.'
                },
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skill 2.3.2: choose a restore method (snapshot restore, PITR, backtrack, DR Region failover) that meets the stated RTO, RPO, and cost requirements.'
                }
              ],
              resources: [
                { name: 'Aurora Backtrack', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.Backtrack.html' }
              ]
            },
            {
              topic: 'Versioning for Storage Services',
              details: [
                'S3 versioning retains multiple versions of an object to protect against accidental deletes and overwrites.',
                {
                  name: 'Example',
                  text: 'Enable S3 versioning on a bucket used for application configuration files so that you can roll back to a previous version if a deployment introduces an invalid configuration.'
                },
                'Lifecycle rules can transition noncurrent versions to cheaper storage tiers (for example, S3 Glacier) and eventually expire them to control cost.',
                'File systems such as Amazon FSx (for example, FSx for Windows) can integrate with snapshot or shadow copy mechanisms to provide file-level restore points.',
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skill 2.3.3: implement versioning for S3 and FSx as part of backup and restore strategies.'
                }
              ],
              resources: [
                { name: 'S3 Versioning', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html' }
              ]
            }
          ]
        },
        {
          title: 'Disaster Recovery (RTO/RPO and Procedures)',
          content: [
            {
              topic: 'RTO, RPO, and DR Strategies',
              details: [
                {
                  name: 'RTO (Recovery Time Objective)',
                  text: 'Maximum acceptable downtime for a system before business impact is unacceptable. Example: “Service must be back online within 1 hour.”'
                },
                {
                  name: 'RPO (Recovery Point Objective)',
                  text: 'Maximum acceptable data loss measured in time. Example: “Can lose at most 15 minutes of data.”'
                },
                {
                  name: 'DR Strategies',
                  text: 'Backup and restore (highest RTO and RPO, lowest cost), pilot light (keep critical core services always on), warm standby (scaled-down full stack running), and multi-site active/active (lowest RTO and RPO, highest cost).'
                },
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skill 2.3.2 and Skill 2.3.4: select the disaster recovery approach that meets stated RTO, RPO, and cost constraints.'
                }
              ],
              image: {
                url: 'https://docs.aws.amazon.com/images/whitepapers/latest/disaster-recovery-of-on-premises-applications-to-aws/images/recoveryobjectives.png',
                alt: 'AWS Recovery Time and Recovery Point Objectives'
              },
              table: {
                title: 'Typical RTO/RPO Targets',
                headers: ['System Type', 'RTO', 'RPO'],
                rows: [
                  ['Mission-critical (for example, payments)', '≤ 5 minutes', '≤ 1 minute'],
                  ['Standard business applications', '≤ 1 hour', '≤ 15 minutes'],
                  ['Non-critical (for example, reports)', '≤ 24 hours', '≤ 24 hours']
                ]
              },
              strategies: [
                'Backup and Restore: highest RTO/RPO, lowest cost.',
                'Pilot Light: minimal core infrastructure always running in DR Region.',
                'Warm Standby: scaled-down but fully functional environment in DR Region.',
                'Multi-Site Active/Active: full production in multiple Regions with traffic distribution via Route 53.'
              ],
              image2: {
                url: 'https://docs.aws.amazon.com/images/whitepapers/latest/disaster-recovery-workloads-on-aws/images/disaster-recovery-strategies.png',
                alt: 'AWS Disaster Recovery Strategies'
              },
              resources: [
                { name: 'Disaster Recovery on AWS', url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html' }
              ]
            },
            {
              topic: 'DR Procedures and Runbooks',
              details: [
                'Disaster recovery plans should be documented as runbooks with clear, ordered steps for failover, data restore, and failback.',
                {
                  name: 'Pattern',
                  text: 'Use Systems Manager Automation or Step Functions to orchestrate DR: stop writes, promote a replica in the DR Region, update Route 53 records, and run data validation checks.'
                },
                'Regular DR drills (game days) validate that people, processes, and automation can meet RTO and RPO objectives.',
                {
                  name: 'Exam Mapping',
                  text: 'Skill 2.3.4 focuses on following DR procedures. Preferred answers often mention documented runbooks, automation, and testing instead of ad hoc manual steps.'
                }
              ],
              resources: [
                { name: 'SSM Automation', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html' }
              ]
            }
          ]
        }
      ]
    },

    'deployment': {
      title: 'Domain 3: Deployment, Provisioning, and Automation (22%)',
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
                "AWS Config: a service that provides a detailed view of your AWS resources, including their configurations, relationships, and how they have changed over time. It's used for compliance auditing, security analysis, and tracking resource changes to help you manage governance and troubleshoot issues.",
                'AWS Config is used to enforce policies by continuously monitoring resource configurations, evaluating them against a set of rules, and then automating remediation actions for non-compliant resources. This process involves defining configuration rules (either using AWS-provided managed rules or custom ones) to check for deviations from desired settings, such as security or tagging policies.',
                'Configuration history tracking',
                'Compliance rules evaluation',
                'Auto-remediation with SSM',
                'Configuration snapshots',
                'Aggregators for multi-account'
              ],
              image: {
                url: 'https://docs.aws.amazon.com/images/config/latest/developerguide/images/how-AWSconfig-works-2.png',
                alt: 'AWS Config'
              },
              resources: [
                { name: 'AWS Config', url: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html' }
              ]
            },
            {
              topic: 'CloudTrail',
              details: [
                'CloudTrail: a service that records user activity and API calls for an AWS account, enabling governance, compliance, and auditing. It logs who made a request, what action was taken, and when, helping with security monitoring, operational troubleshooting, and identifying potential issues.',
                'Records events: It logs events, such as a user creating an Amazon S3 bucket, and delivers log files to an Amazon S3 bucket.',
                'Management events: Control plane',
                'Data events: S3/Lambda operations',
                'Insights: Unusual activity detection',
                'Event history: 90 days free',
                'S3 logging with integrity validation',
                'Provides visibility: It provides visibility into user activity by recording who made the request, the services used, the actions performed, and the parameters and responses for those actions.',
                'Answers "who, what, where, and when": It helps answer fundamental questions about your AWS environment by tracking actions taken through the AWS Management Console, Command Line Interface (CLI), and SDKs.'
              ],
              image: {
                url: 'https://media.amazonwebservices.com/blog/2013/cloudtrail_flow_4.png',
                alt: 'AWS CloudTrail'
              },
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
                'VPC: a secure, isolated, private network hosted on a public cloud, closely resembles a traditional network that you would operate in your own data center. After you create a VPC, you can add subnets.',
                'Each VPC is confined to a single region.',
                'Subnet: a range of IP addresses in your VPC. A subnet must reside in a single Availability Zone. After you add subnets, you can deploy AWS resources in your VPC.',
                'Each subnet in a VPC is confined to a single AZ.',
                'Default limit: The default limit is five VPCs per region',
                'Adjustable limit: You can request a quota increase from AWS to have more VPCs per region.',
                'CIDR blocks: /16 to /28',
                'Public subnet: Route to IGW',
                'Private subnet: Route to NAT',
                'Route table priority: Most specific',
                'Local route: Cannot be deleted',
                'VPC Peering: No transitive routing'
              ],
              image: {
                url: 'https://d2908q01vomqb2.cloudfront.net/77de68daecd823babbb58edb1c8e14d7106e83bb/2021/06/15/VPC-Network-Engineers-Part-1-1.png',
                alt: 'AWS VPCs and Subnets'
              },
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
              image: {
                url: 'https://docs.aws.amazon.com/images/vpc/latest/userguide/images/security-group-overview.png',
                alt: 'Security Groups'
              },
              image2: {
                url: 'https://docs.aws.amazon.com/images/vpc/latest/userguide/images/network-acl.png',
                alt: 'NACLs'
              },
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
              image: {
                url: 'https://docs.aws.amazon.com/images/vpc/latest/userguide/images/connectivity-overview.png',
                alt: 'Connect your VPC to other networks'
              },
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
                'Amazon CloudFront is a web service that speeds up distribution of your static and dynamic web content, such as .html, .css, .js, and image files, to your users.',
                "CloudFront works as a content delivery network (CDN) by storing cached copies of your content in its global network of data centers called edge locations. When a user requests content, it is delivered from the edge location geographically closest to them, which reduces latency and speeds up delivery. If the content isn't in that cache, CloudFront fetches it from the origin server, delivers it to the user, and then caches it at the edge location for future requests.",
                'Origins: S3, ALB, or HTTP server; with support for origin failover and custom origin headers',
                "Behaviors: Path patterns for URL-specific rules, cache settings per pattern, origin routing, viewer protocols, TTL settings",
                "Security features: SSL/TLS encryption, field-level encryption, integration with AWS Shield and WAF, geographic restrictions, and signed URLs/cookies for private content access",
                "Performance: Regional edge caches, origin shield protection, compression options, custom error responses",
                "TTL: Minimum/maximum/default cache durations, override origin headers, custom cache control",
                "Invalidations: Remove specific content from edge caches, wildcard patterns, batch processing",
                'Origin access identity for S3, SSL/TLS certificates, field-level encryption, WAF integration',
                "Protocol handling with options for HTTP/HTTPS, HTTPS-only, or Match Viewer settings, along with support for custom SSL certificates and SNI"
              ],
              image: {
                url: 'https://docs.aws.amazon.com/images/AmazonCloudFront/latest/DeveloperGuide/images/how-you-configure-cf.png',
                alt: 'AWS CloudFront'
              },
              resources: [
                { name: 'CloudFront', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html' }
              ]
            }
          ]
        }
      ]
    },
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
      explanation: 'CloudFormation event history shows detailed information about each resource creation/update, including error messages for failures.',
  image: {
    url: 'https://docs.aws.amazon.com/images/AWSCloudFormation/latest/UserGuide/images/deployment-timeline-graph.PNG',
    alt: ' Last deployment timelines'
  }
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
    },
    {
      id: 9,
      domain: 'Networking',
      question: `A financial start-up has recently adopted a hybrid cloud infrastructure with AWS Cloud. They are planning to migrate their online payments system that supports an IPv6 address and uses an Oracle database in a RAC configuration. As the AWS Consultant, you have to make sure that the application can initiate outgoing traffic to the Internet but blocks any incoming connection from the Internet.

Which of the following options would you do to properly migrate the application to AWS?`,
      options: [
        'Migrate the Oracle database to an EC2 instance. Launch an EC2 instance to host the application and then set up a NAT Instance.',
        'Migrate the Oracle database to RDS. Launch an EC2 instance to host the application and then set up a NAT gateway instead of a NAT instance for better availability and higher bandwidth.',
        'Migrate the Oracle database to RDS. Launch the application on a separate EC2 instance and then set up a NAT Instance.',
        'Migrate the Oracle database to an EC2 instance. Launch the application on a separate EC2 instance and then set up an egress-only Internet gateway.'
      ],
      correct: 3,
      explanation: `An egress-only Internet gateway is a horizontally scaled, redundant, and highly available VPC component that allows outbound communication over IPv6 from instances in your VPC to the Internet, and prevents the Internet from initiating an IPv6 connection with your instances.

An instance in your public subnet can connect to the Internet through the Internet gateway if it has a public IPv4 address or an IPv6 address. Similarly, resources on the Internet can initiate a connection to your instance using its public IPv4 address or its IPv6 address; for example, when you connect to your instance using your local computer.

IPv6 addresses are globally unique, and are therefore public by default. If you want your instance to be able to access the Internet but want to prevent resources on the Internet from initiating communication with your instance, you can use an egress-only Internet gateway. To do this, create an egress-only Internet gateway in your VPC, and then add a route to your route table that points all IPv6 traffic (::/0) or a specific range of IPv6 address to the egress-only Internet gateway. IPv6 traffic in the subnet that’s associated with the route table is routed to the egress-only Internet gateway.`
    },
    {
      id: 10,
      domain: 'Networking',
      question: `You are designing a VPC with both public and private subnets. EC2 instances in the private subnets must download security updates from the internet.
Where should you place the NAT Gateway?`,
      options: [
        'In a private subnet',
        'In a public subnet with a route to an Internet Gateway',
        'In a private subnet with a route to a Virtual Private Gateway',
        'In any subnet as long as it has a route to an Elastic IP'
      ],
      correct: 1,
      explanation: 'NAT Gateways must be in a public subnet with a route to an Internet Gateway (IGW) and an Elastic IP so private instances can access the internet.'
    },
    {
      id: 11,
      domain: 'Networking',
      question: 'Where must a NAT Gateway be placed to provide internet access for instances in private subnets?',
  options: [
    'In any subnet with a route to a VGW',
    'In a private subnet with a route to an IGW',
    'In a public subnet with a route to an IGW and an Elastic IP',
    'In a transit subnet attached to a TGW'
  ],
  correct: 2,
  explanation: 'A public NAT Gateway must reside in a public subnet, have a route to an Internet Gateway, and be associated with an Elastic IP to allow private subnets outbound internet access.'
},
{
  id: 12,
  domain: 'Networking',
  question: 'Private EC2 instances must access Amazon S3 without traversing the internet and without paying NAT data processing costs. What is the BEST solution?',
  options: [
    'Use a NAT Gateway in a public subnet',
    'Create a VPC Gateway Endpoint for S3',
    'Use an Interface Endpoint for S3',
    'Attach a Virtual Private Gateway'
  ],
  correct: 1,
  explanation: 'A VPC Gateway Endpoint for S3 keeps traffic on the AWS network, removes the need for a NAT Gateway for S3 access, and reduces cost.'
},
{
  id: 13,
  domain: 'Networking',
  question: 'Which statement about Private NAT Gateways is TRUE?',
  options: [
    'They provide outbound internet access for private subnets',
    'They require an Elastic IP',
    'They perform NAT between private networks (no IGW path)',
    'They are created automatically with every VPC'
  ],
  correct: 2,
  explanation: 'Private NAT Gateways are used for private-to-private translation (e.g., across VPCs/VPN/TGW) and do not use Elastic IPs or the Internet Gateway.'
},
{
  id: 14,
  domain: 'Networking',
  question: 'Private instances must reach AWS public service endpoints (e.g., sts.amazonaws.com) and third-party SaaS APIs. No VPC Endpoints are in use. What enables this?',
  options: [
    'Transit Gateway',
    'Public NAT Gateway',
    'VPC Peering',
    'Virtual Private Gateway'
  ],
  correct: 1,
  explanation: 'Without VPC Endpoints, private subnets use a public NAT Gateway to reach public AWS service endpoints and external SaaS over the internet path.'
},
{
  id: 15,
  domain: 'Security',
  question: 'Which AWS service is designed to block application-layer injection attacks such as SQLi and XSS?',
  options: [
    'AWS Shield Advanced',
    'AWS WAF',
    'Amazon GuardDuty',
    'AWS Firewall Manager (standalone)'
  ],
  correct: 1,
  explanation: 'AWS WAF filters HTTP(S) traffic and includes managed rule groups for SQLi/XSS. Shield focuses on DDoS availability protection.'
},
{
  id: 16,
  domain: 'Security',
  question: 'Where can you attach AWS WAF to protect your application?',
  options: [
    'EC2 security groups and NACLs',
    'Application Load Balancer, Amazon CloudFront, API Gateway, and AppSync',
    'Internet Gateway and NAT Gateway',
    'VPC Endpoint and Transit Gateway'
  ],
  correct: 1,
  explanation: 'WAF integrates with ALB, CloudFront, API Gateway, and AppSync to inspect and control Layer-7 requests before they reach your app.'
},
{
  id: 17,
  domain: 'Reliability',
  question: 'Which statement best defines RTO (Recovery Time Objective)?',
  options: [
    'The maximum acceptable data loss measured in time',
    'The average request latency under peak load',
    'The maximum time to restore service after a disruption',
    'The minimum backup frequency required by policy'
  ],
  correct: 2,
  explanation: 'RTO is the target maximum time to recover service to an acceptable level after an outage.'
},
{
  id: 18,
  domain: 'Reliability',
  question: 'Which statement best defines RPO (Recovery Point Objective)?',
  options: [
    'The maximum acceptable data loss measured in time',
    'The time it takes to fail over to a standby region',
    'The longest acceptable maintenance window',
    'The number of replicas required for quorum'
  ],
  correct: 0,
  explanation: 'RPO is the target limit for how much data (in time) you can afford to lose after an incident.'
},
{
  id: 19,
  domain: 'Databases',
  question: 'You need your RDS MySQL database state from exactly 7 days ago. What should you use?',
  options: [
    'Restore from a manual snapshot only',
    'Point-in-Time Restore using automated backups',
    'Aurora Backtrack (rewind)',
    'Export snapshot to S3 and re-import'
  ],
  correct: 1,
  explanation: 'Standard RDS MySQL supports Point-in-Time Restore within the automated backup retention window and creates a new DB instance at that time.'
},
{
  id: 20,
  domain: 'Databases',
  question: 'You dropped a table 3 hours ago in Amazon Aurora MySQL and need the fastest recovery without creating a new instance. What feature helps?',
  options: [
    'RDS Point-in-Time Restore',
    'Aurora Backtrack',
    'Multi-AZ failover',
    'Read replica promotion'
  ],
  correct: 1,
  explanation: 'Aurora Backtrack lets you rewind the cluster to a prior time (up to the configured window, max 72 hours) without creating a new instance.'
},
{
  id: 21,
  domain: 'Networking',
  question: 'Instances in a private subnet cannot reach the internet despite a NAT Gateway existing. What is the MOST likely cause?',
  options: [
    'The private subnet route table sends 0.0.0.0/0 to the Internet Gateway',
    'The NAT Gateway was created in a private subnet',
    'The NAT Gateway has an Elastic IP associated',
    'The public subnet route table has a route to the IGW'
  ],
  correct: 1,
  explanation: 'A NAT Gateway placed in a private subnet cannot reach the IGW. It must be in a public subnet with a route to the IGW.'
},
{
  id: 22,
  domain: 'Networking',
  question: 'Your IPv6-enabled private subnet should reach the internet but must block inbound IPv6 connections from the internet. What should you use?',
  options: [
    'NAT Gateway',
    'Egress-only Internet Gateway',
    'Private NAT Gateway',
    'VPC Endpoint'
  ],
  correct: 1,
  explanation: 'For IPv6, use an egress-only Internet Gateway to allow outbound traffic while preventing unsolicited inbound connections.'
},
  {
    id: 23,
    domain: 'Networking',
    question: 'A financial start-up has recently adopted a hybrid cloud infrastructure with AWS Cloud. They are planning to migrate their online payments system that supports an IPv6 address and uses an Oracle database. Which of the following options would you do to properly migrate the application to AWS?',
    options: [
      'Migrate the Oracle database to an EC2 instance. Launch an EC2 instance to host the application and then set up a NAT Instance.',
      'Migrate the Oracle database to RDS. Launch the application on a separate EC2 instance and then set up a NAT Instance.',
      'Migrate the Oracle database to an EC2 instance. Launch the application on a separate EC2 instance and then set up an egress-only Internet gateway.',
      'Migrate the Oracle database to RDS. Launch an EC2 instance to host the application and then set up a NAT gateway instead of a NAT instance for better availability and higher bandwidth.'
    ],
    correct: 2,
    explanation: 'An egress-only Internet gateway is a horizontally scaled, redundant, and highly available VPC component that allows outbound communication over IPv6 from instances in your VPC to the Internet. This is recommended for IPv6 workloads that want to block inbound connections.'
  },
  {
    id: 24,
    domain: 'Deployment, Provisioning, and Automation',
    question: 'A SysOps Administrator needs to create a CloudFormation template that should automatically rollback in the event that the entire stack failed to launch. The application stack requires the signal of successful creation from the resources. What should you configure?',
    options: [
      'In the ResourceSignal parameter of the Conditions resource attribute, add a Timeout property with a value of 2 hours.',
      'In the ResourceSignal parameter of the UpdatePolicy resource attribute, add a Timeout property with a value of 2 hours.',
      'In the ResourceSignal parameter of the CreationPolicy resource attribute, add a Timeout property with a value of 2 hours.',
      'In the ResourceSignal parameter of the DependsOn resource attribute, add a Timeout property with a value of 2 hours.'
    ],
    correct: 2,
    explanation: 'Associate the CreationPolicy attribute with a resource to prevent its status from reaching CREATE_COMPLETE until AWS CloudFormation receives a specified number of success signals or the timeout period is reached.'
  },
  {
    id: 25,
    domain: 'Reliability and Business Continuity',
    question: 'A company’s marketing website utilizes an RDS database instance to store transactional data. As the user visits grow, the IT department decides to implement a caching service for faster response times and higher availability. Which combination of actions should you take? (Select TWO)',
    options: [
      'Utilize Amazon ElastiCache for Redis data store to support the demands of the database.',
      'Activate Multi-AZ deployment for the data store.',
      'Use an in-memory cache service like Amazon ElastiCache for Memcached data store.',
      'Manage cache node connections using Auto Discovery.',
      'Use Multi-threading for the RDS database instance.'
    ],
    correct: [0, 1],
    explanation: 'Amazon RDS provides high availability and failover support for DB instances using Multi-AZ deployments, which maintain a synchronous standby replica in a different Availability Zone. To further improve performance, utilize Amazon ElastiCache for Redis as a caching layer.'
  },
  {
    id: 26,
    domain: 'Networking and Content Delivery',
    question: 'A leading national bank migrated its on-premises infrastructure to AWS. The SysOps Administrator noticed that the cache hit ratio of the CloudFront web distribution is less than 15%. What should be done to increase the cache hit ratio?',
    options: [
      'Set the Viewer Protocol Policy of your web distribution to only use HTTPS to serve media content.',
      'In the Cache Behavior settings of your distribution, configure to forward only the query string parameters for which your origin will return unique objects.',
      'Use Signed URLs to your CloudFront web distribution.',
      'Configure your origin to add a Cache-Control max-age directive to your objects, and specify the longest practical value for max-age to increase your TTL.',
      'Always add the Accept-Encoding header to compress all the content for each and every request.'
    ],
    correct: [1, 3],
    explanation: 'To increase the cache hit ratio, configure CloudFront to forward only the query string parameters for which your origin will return unique objects, and set the Cache-Control max-age directive to a high TTL value to keep objects cached longer.'
  },
  {
    id: 27,
    domain: 'Performance Optimization',
    question: 'A company is deploying a web application on Amazon EC2 instances. To handle spikes in traffic, the web application needs application-level caching of database query results and frequently accessed data. What should you do?',
    options: [
      'Implement application-level caching by running Memcached on the EC2 instances.',
      'Configure Amazon ElastiCache (Redis OSS) for the application.',
      'Deploy Amazon API Gateway and configure caching at the API level.',
      'Deploy an Amazon CloudFront distribution with a custom origin to cache application responses.'
    ],
    correct: 1,
    explanation: 'ElastiCache caches frequently accessed data to improve the performance of web applications. ElastiCache also provides in-memory caching that is scalable and helps handle spikes in traffic efficiently.'
  },
  {
    id: 28,
    domain: 'Reliability and Business Continuity',
    question: 'A company uses AWS Organizations with multiple AWS accounts across several organizational units (OUs). A CloudOps engineer must configure AWS Backup with centralized administration and a centralized backup vault. What should they do?',
    options: [
      'Enable Organizations service control policies (SCPs) to require backups for all accounts and resources. Create individual backup plans and vaults in each member account.',
      'Enable Organizations service control policies (SCPs) to require backups for all accounts and resources. Deploy a centralized backup plan with an organization-wide backup vault by using AWS CloudFormation.',
      'Enable cross-account backup in AWS Backup in each member account. Create a backup plan with a centralized backup vault in each member account. Apply the backup plan to the relevant resources.',
      'Enable cross-account backup in AWS Backup in the management account. Create a backup plan with a centralized backup vault in the management account. Apply the backup plan to the relevant resources.'
    ],
    correct: 3,
    explanation: 'You need to enable cross-account backups with centralized administration and a centralized vault in the management account of AWS Backup. Then, you can create the backup plan and vault in the management account and apply it to all resources.'
  },
  {
    id: 29,
    domain: 'Deployment and Automation',
    question: 'A software company is running a containerized application on an Amazon Elastic Kubernetes Service (Amazon EKS) cluster. The application must use a new feature that is available in the latest Kubernetes version. What is the recommended way to upgrade the cluster?',
    options: [
      'Create an Amazon CloudWatch dashboard that shows all relevant metrics for the cluster. Identify the current usage of CPU and memory. Use the Kubernetes release update to identify if the available resources are enough.',
      'Use the AWS CloudFormation infrastructure as code (IaC) generator to extract the current cluster configuration in a template. Update the template to provision a new cluster that uses the latest Kubernetes version.',
      'Use the AWS CLI command update-cluster-version with the required version as an input. Use the --generate-cli-skeleton flag. Review the JSON output, and check for warnings.',
      'Use Amazon EKS cluster insights to identify issues on the running cluster. Use the tool recommendations to resolve pending issues. Refresh Amazon EKS cluster insights to verify that all issues have been resolved.'
    ],
    correct: 3,
    explanation: 'Amazon EKS cluster insights is a feature that provides recommendations on Amazon EKS and Kubernetes best practices. You can use cluster insights to evaluate cluster readiness against a new version and to resolve any issues before upgrading.'
  },
  {
    id: 30,
    domain: 'Networking and Content Delivery',
    question: 'A company has two Amazon EC2 instances. Instance A is in VPC A. Instance B is in VPC B. A CloudOps engineer correctly configured VPC peering between both VPCs. Instance A can ping instance B, but instance B cannot ping instance A. What is the most likely cause?',
    options: [
      'Attach an internet gateway to VPC B.',
      'Attach a NAT gateway to VPC A.',
      'Update the instance B security group to allow inbound Internet Control Message Protocol (ICMP) traffic.',
      'Update the instance A security group to allow inbound Internet Control Message Protocol (ICMP) traffic.'
    ],
    correct: 3,
    explanation: 'EC2 security groups are stateful. Instance A initiated the first ping. Therefore, the response is permitted. The second ping is blocked by instance A security group. To troubleshoot this, update the instance A security group to allow inbound ICMP traffic.'
  },
  {
    id: 31,
    domain: 'Reliability and Business Continuity',
    question: 'A financial company runs a transaction processing system. The system uses an Amazon RDS for MySQL database with a Multi-AZ deployment. The company expects a seasonal spike in traffic and wants to automatically adjust database capacity based on demand. What should you do?',
    options: [
      'Migrate the database to Amazon Aurora Serverless v2.',
      'Configure Amazon RDS for MySQL read replicas in different AWS Regions.',
      'Enable Amazon RDS storage auto scaling to adjust capacity based on demand.',
      'Increase the Amazon RDS instance size to a larger provisioned capacity and enable auto scaling.'
    ],
    correct: 0,
    explanation: 'Aurora Serverless v2 is a relational database that is compatible with MySQL. Aurora Serverless v2 can automate the process of monitoring a workload and adjusting capacity based on traffic spikes and demand.'
  },
  {
    id: 32,
    domain: 'Deployment and Automation',
    question: 'A company uses AWS Organizations. The company wants to simplify the management of resource deployments. A CloudOps engineer must deploy an AWS CloudFormation stack set. The stack set must automatically create the required IAM roles in target accounts. What is the best way to achieve this?',
    options: [
      'Use the self-managed permissions model for role creation and management across the organization.',
      'Use the service-managed permissions model for role creation and management across the organization.',
      'Use AWS Config to propagate roles and permissions across accounts before deploying the stack set.',
      'Use Amazon EventBridge to invoke AWS Lambda functions that create IAM roles in each account before deploying the stack set.'
    ],
    correct: 1,
    explanation: 'The service-managed permissions model for CloudFormation StackSets automatically creates the required IAM roles in target accounts when you use Organizations. This avoids manual steps and simplifies permissions management.'
  },
  {
    id: 33,
    domain: 'Deployment and Automation',
    question: 'A CloudOps engineer must automate the creation of custom Amazon Machine Images (AMIs). The CloudOps engineer notices timeout errors on the EC2 Image Builder pipeline. What is the cause of the issue?',
    options: [
      'There are insufficient permissions granted to the Image Builder role that is configured in the pipeline.',
      'The base AMI that is specified in the configuration is no longer available.',
      'The AWS Systems Manager Agent (SSM Agent) on the build instance is not running or reachable.',
      'The Image Builder pipeline was tagged with the key value executable set to false.'
    ],
    correct: 2,
    explanation: 'Image Builder uses the SSM Agent to manage the build instance and to run build components. If the SSM Agent is not running, is unresponsive, or cannot be reached, the pipeline will time out.'
  },
  {
    id: 34,
    domain: 'Networking and Content Delivery',
    question: 'A company sends metrics and logs to a third-party vendor for long-term storage. Both the company and the third-party vendor use the AWS Cloud. Currently, the data is transmitted over the public internet. What should they do to securely transmit this data over the AWS network?',
    options: [
      "Create an interface VPC endpoint in the company's VPC. Associate the endpoint with the AWS PrivateLink service.",
      "Create a gateway VPC endpoint in the company's VPC. Associate the endpoint with the AWS PrivateLink service.",
      "Create an AWS PrivateLink service in the third-party vendor's VPC.",
      "Create an AWS PrivateLink service in the company's VPC.",
      "Create VPC peering with the third-party vendor's VPC."
    ],
    correct: [0, 2],
    explanation: 'An interface VPC endpoint is a network interface with a private IP address that serves as an entry point for traffic going to a supported service. As the service consumer, the company should create the interface endpoint, and the third-party vendor should create the PrivateLink service.'
  }
];
  
  // Helper to check if a question is multiple answer
const isMultipleAnswer = (question) => Array.isArray(question.correct);

// Helper to compare two arrays for equality (order-insensitive)
const arraysEqual = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return [...a].sort().every((val, idx) => [...b].sort()[idx] === val);
};

  const splitSentences = (text) => {
    return text.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()) || [text];
  };
  
  const splitSafe = (text) =>
  text
    .split(/(?<!\b(?:e\.g|i\.e))\.\s+/i)  // split only on ". " NOT preceded by "e.g" or "i.e"
    .map(s => s.trim())
    .filter(Boolean);

  const parseBoldText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => 
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    ).filter(part => part !== '');
  };

  const renderInlineCode = (text) => {
  // Split on segments wrapped in `...`
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
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
                  {Object.entries(item).map(([key, value], idx) => {
                    // Topic as header
                    if (key === "topic") {
                      return <h4 key={idx} className="font-semibold text-gray-800 mb-2">{value}</h4>;
                    }
                    // Details as a list
                    if (key === "details") {
                      return (
                        <ul
                          key={idx}
                          className="list-disc list-inside space-y-1 text-gray-600 text-sm"
                        >
                          {value.map((detail, detailIdx) => {
                            // 1) Simple string detail → normal bullet
                            if (typeof detail === "string") {
                              return (
                                <li key={detailIdx}>
                                  {renderInlineCode(detail)}
                                </li>
                              );
                            }
                    
                            // 2) Object detail → "Examples", "CLI Example", etc.
                            return (
                              <li
                                key={detailIdx}
                                className="list-none ml-1"  // ⬅ removes the stray bullet
                              >
                                {/* Header like "CLI Example", "Examples", "Exam Pattern", etc. */}
                                <div className="flex items-start gap-2">
                                  <span className="text-gray-500">⤷</span>
                                  <span className="text-gray-700 text-sm font-semibold">
                                    {detail.url ? (
                                      <a
                                        href={detail.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800"
                                      >
                                        {detail.name}
                                      </a>
                                    ) : (
                                      detail.name
                                    )}
                                    {detail.name ? ":" : null}
                                  </span>
                                </div>
                    
                                {/* Sub-examples inside, each with → and inline code */}
                                {typeof detail.text === "string" && (
                                  <div className="ml-6 mt-1 space-y-0.5">
                                
                                    {splitSafe(detail.text).map((sentence, sIdx) => (
                                      <div
                                        key={sIdx}
                                        className="flex items-start gap-2"
                                      >
                                        <span className="text-gray-400">→</span>
                                        <span className="text-gray-600 text-sm">
                                          {renderInlineCode(sentence)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      );
                    }
                    // Table rendering
                    if (key === "table" && value) {
                      return (
                        <div key={idx} className="mt-4 overflow-x-auto">
                          <p className="text-sm font-semibold text-gray-700 mb-2">{value.title}</p>
                          <table className="min-w-full border border-gray-300 text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                {value.headers.map((header, hIdx) => (
                                  <th key={hIdx} className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">{header}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {value.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-gray-50">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="border border-gray-300 px-3 py-2 text-gray-600">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                    // Images: image, image2, imageDiagram, etc.
                    if (key.startsWith("image") && value) {
                      return (
                        <div key={idx} className="mt-4 flex justify-center">
                          <img
                            src={value.url}
                            alt={value.alt || 'Diagram'}
                            className="max-w-full md:max-w-2xl h-auto rounded-lg border border-gray-300"
                          />
                        </div>
                      );
                    }
                    // Strategies rendering
                    if (key === "strategies") {
                      return (
                        <div key={idx} className="mt-3">
                          <p className="text-sm font-semibold text-gray-700 mb-1">DR Strategies:</p>
                          <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                            {value.map((strategy, sIdx) => (
                              <li key={sIdx}>{strategy}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    // Resources rendering
                    if (key === "resources") {
                      return (
                        <div key={idx} className="mt-3 space-y-1">
                          {value.map((resource, resIdx) => (
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
                      );
                    }
                    // Add other property renderers as needed
                    return null;
                  })}
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
  const multiple = isMultipleAnswer(question);
  const selected = selectedAnswers[question.id] ?? (multiple ? [] : undefined);
  const answered = multiple ? selected.length > 0 : selected !== undefined;
  const correct = multiple
    ? arraysEqual(selected, question.correct)
    : selected === question.correct;

  return (
    <div key={question.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start gap-3 mb-4">
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
          {question.domain}
        </span>
        <p className="text-gray-800 font-medium flex-1">{question.question}</p>
        {multiple && (
          <span className="text-xs bg-purple-100 text-purple-700 rounded px-2 py-0.5 ml-2 font-semibold">Select all that apply</span>
        )}
      </div>
      <div className="space-y-2 mb-4">
        {question.options.map((option, idx) => {
          const checked = multiple ? selected.includes(idx) : selected === idx;
          let optionStyle = "border-gray-300 hover:bg-gray-50";
          if (answered && showAnswers[question.id]) {
            if (multiple && question.correct.includes(idx)) {
              optionStyle = "border-green-500 bg-green-50";
            } else if (!multiple && idx === question.correct) {
              optionStyle = "border-green-500 bg-green-50";
            } else if (checked && !correct) {
              optionStyle = "border-red-500 bg-red-50";
            }
          } else if (checked) {
            optionStyle = "border-blue-500 bg-blue-50";
          }
          return (
            <label
              key={idx}
              className={`block p-3 rounded-lg border cursor-pointer transition-colors ${optionStyle}`}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name={`question-${question.id}${multiple ? `-${idx}` : ""}`}
                value={idx}
                checked={checked}
                onChange={() => {
                  if (multiple) {
                    setSelectedAnswers(prev => {
                      const arr = prev[question.id] ?? [];
                      return {
                        ...prev,
                        [question.id]: checked
                          ? arr.filter(i => i !== idx)
                          : [...arr, idx]
                      };
                    });
                  } else {
                    setSelectedAnswers(prev => ({ ...prev, [question.id]: idx }));
                  }
                }}
                className="mr-3"
              />
              <span className="text-gray-700">{option}</span>
              {showAnswers[question.id] && (
                multiple
                  ? question.correct.includes(idx) && (
                      <CheckCircle className="w-5 h-5 text-green-600 inline-block ml-2" />
                    )
                  : idx === question.correct && (
                      <CheckCircle className="w-5 h-5 text-green-600 inline-block ml-2" />
                    )
              )}
            </label>
          );
        })}
      </div>
      <button
        onClick={() => setShowAnswers(prev => ({ ...prev, [question.id]: true }))}
        disabled={!answered}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          !answered
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Check Answer
      </button>
      {showAnswers[question.id] && (
        <div className={`mt-4 p-4 rounded-lg ${
          correct ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-start gap-2">
            {correct ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            )}
            <div>
              <p className="text-gray-700 text-sm">{question.explanation}</p>
              {question.image && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={question.image.url}
                    alt={question.image.alt || 'Explanation image'}
                    className="max-w-full md:max-w-lg h-auto rounded border border-gray-300"
                  />
                </div>
              )}
            </div>
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
          <h1 className="text-3xl font-bold mb-2">AWS CloudOps Engineer Exam Reference</h1>
          <p className="text-orange-100">Complete guide to ace the SOA-C03 exam with a perfect score</p>
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
                    <li>• Exam Code: SOA-C03</li>
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
