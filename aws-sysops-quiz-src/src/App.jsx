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
            topic: 'AWS Systems Manager, SSM Agent & Session Manager',
            details: [
              { name: 'AWS Systems Manager (SSM)', text: 'It helps you centrally view, manage, monitor, and operate nodes at scale in AWS, on-premises, and multicloud environments.' },
              'Key features include automating tasks like patch management and user management, enabling secure remote access to instances without SSH or bastion hosts, and providing a centralized view of your resources with capabilities like natural language querying via Amazon Q Developer.',
              'Monitoring is an important part of maintaining the reliability, availability, and performance of AWS Systems Manager and your AWS solutions. You should collect monitoring data from all parts of your AWS solution so that you can debug a multipoint failure if one occurs.',
              'For example, you can monitor the success or failure of operations such as Automation workflows, the application of patch baselines, maintenance window events, and configuration compliance. Automation is a tool in AWS Systems Manager.',
              'You can also monitor CPU utilization, disk I/O, and network utilization of your managed nodes. When performance falls outside your established baseline, you might need to reconfigure or optimize the node to reduce CPU utilization, improve disk I/O, or reduce network traffic. For more information about monitoring EC2 instances, see Monitor Amazon EC2 in the Amazon EC2 User Guide.',
              { name: 'SSM Agent', text: "It is a software component that runs on various nodes, such as Amazon EC2 instances, on-premises servers, and virtual machines, to enable them to be managed by AWS Systems Manager. It processes requests from the Systems Manager service to perform tasks like updating, configuring, and managing the node's resources. The agent enables core functionalities such as `Run Command`, which allows remote command execution, and Session Manager, which provides a secure, interactive shell to instances. It's pre-installed on many Amazon Linux and Windows AMIs; required for Systems Manager operations."},
              'Session Manager gives browser/CLI-based shell access without SSH keys, bastion hosts, or opening inbound ports.',
              'Session logs can be sent to S3 and CloudWatch Logs for audit/compliance.',
              'Access controlled via IAM policies, enabling fine-grained least-privilege access to instances.',
              { name: 'SSM Automation', text: 'Automation, a tool in AWS Systems Manager, simplifies common maintenance, deployment, and remediation tasks for AWS services. An Automation runbook defines the actions (predefined procedures to achieve a specific outcome) that SSM performs on your managed instances and other AWS resources when an automation runs. Runbooks use YAML or JSON, and they include steps and parameters that you specify. Steps run in sequential order. Runbooks should contain the minimum information necessary to successfully perform the procedure. Start with a valid effective manual process, implement it in code and trigger automated execution where appropriate.'},
              { name: 'State Manager', text: 'A tool in AWS Systems Manager, is a secure and scalable configuration management service that automates the process of keeping your managed nodes and other AWS resources in a state that you define.'},
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
    reliability: {
      title: 'Domain 2: Reliability and Business Continuity (22%)',
      sections: [
        {
          title: 'Scalability & Elasticity (Auto Scaling & Caching)',
          content: [
            {
              topic: 'EC2 Auto Scaling',
              details: [
                'An Amazon EC2 Auto Scaling group contains a collection of EC2 instances that are treated as a logical grouping for the purposes of automatic scaling and management. An Amazon EC2 Auto Scaling group also lets you use Amazon EC2 Auto Scaling features such as health check replacements and scaling policies. Both maintaining the number of instances in an Amazon EC2 Auto Scaling group and automatic scaling are the core functionality of the Amazon EC2 Auto Scaling service.',
                'The size of an Amazon EC2 Auto Scaling group depends on the number of instances that you set as the desired capacity. You can adjust its size to meet demand, either manually or by using automatic scaling.',
                'An Amazon EC2 Auto Scaling group starts by launching enough instances to meet its desired capacity. It maintains this number of instances by performing periodic health checks on the instances in the group. The Amazon EC2 Auto Scaling group continues to maintain a fixed number of instances even if an instance becomes unhealthy. If an instance becomes unhealthy, the group terminates the unhealthy instance and launches another instance to replace it. For more information, see Health checks for instances in an Amazon EC2 Auto Scaling group.',
                'You can use scaling policies to increase or decrease the number of instances in your group dynamically to meet changing conditions. When the scaling policy is in effect, the Amazon EC2 Auto Scaling group adjusts the desired capacity of the group, between the minimum and maximum capacity values that you specify, and launches or terminates the instances as needed. You can also scale on a schedule. For more information, see Choose your scaling method.',
                'When creating an Amazon EC2 Auto Scaling group, you can choose whether to launch On-Demand Instances, Spot Instances, or both. You can specify multiple purchase options for your Amazon EC2 Auto Scaling group only when you use a launch template. For more information, see Amazon EC2 Auto Scaling groups with multiple instance types and purchase options.',
                'Spot Instances provide you with access to unused EC2 capacity at steep discounts relative to On-Demand prices. When a Spot Instance is terminated, the Amazon EC2 Auto Scaling group attempts to launch a replacement instance to maintain the desired capacity for the group.',
                'When instances are launched, if you specified multiple Availability Zones, the desired capacity is distributed across these Availability Zones. If a scaling action occurs, Amazon EC2 Auto Scaling automatically maintains balance across all of the Availability Zones that you specify.',
                'Key policies: target tracking, step scaling, scheduled scaling, and predictive scaling.',
                'A tracking scaling policy automatically scales the capacity of your Amazon EC2 Auto Scaling group based on a target metric value, keeping a metric (for example, `ASGAverageCPUUtilization` at 50%) similar to a thermostat.',
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
                'ALB and NLB distribute traffic across healthy targets in one or more Availability Zones, , but they operate at different layers of the network model and have different features. ALB works at Layer 7 (Application Layer) and is ideal for HTTP/HTTPS traffic, offering advanced routing like host-based or path-based routing. NLB operates at Layer 4 (Transport Layer), providing high-performance, low-latency handling for TCP, UDP, and TLS traffic, and supports static IPs. ',
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
                'Health checks can monitor CloudWatch alarms to base DNS decisions on higher-level metrics (for example, ALB 5xx rate because of HTTP level).',
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
              topic: 'Amazon EC2 launch templates',
              details: [
                {
                  name: 'EC2 launch template',
                  text: 'It is used to store instance launch parameters so that you do not have to specify them every time you launch an Amazon EC2 instance.'
                },
                'For example, you can create a launch template that stores the AMI ID, instance type, and network settings that you typically use to launch instances.',
                'When you launch an instance using the Amazon EC2 console, an AWS SDK, or a command line tool, you can specify the launch template instead of entering the parameters again.',
                'For each launch template, you can create one or more numbered launch template versions. Each version can have different launch parameters.',
                'When you launch an instance from a launch template, you can use any version of the launch template.',
              ],
              image: {
                url: 'https://docs.aws.amazon.com/images/AWSEC2/latest/UserGuide/images/launch-template-diagram.png',
                alt: 'AWS Launch Template Diagram'
              },
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
            ]    // closes inner array(s) of reliability.sections
          }        // closes last object in reliability.sections array
        ]          // closes reliability.sections array
      },           // closes reliability object **with comma**, as next property follows
  
    deployment: { // begins next top-level object at same level as monitoring/reliability
      title: 'Domain 3: Deployment, Provisioning, and Automation (22%)',
      sections: [
        {
          title: 'CloudFormation & AWS CDK (IaC Core)',
          content: [
            {
              topic: 'Stack Operations',
              details: [
                'Create/Update/Delete stacks to manage related resources as a single unit.',
                'Change sets let you preview what will change before executing an update (safe updates in production).',
                'Stack policies protect critical resources from accidental updates (for example, prevent DB deletion).',
                'Drift detection identifies resources that have been changed outside CloudFormation.',
                'Nested stacks improve reusability and modular design (shared VPC, IAM, networking, logging templates).',
                'StackSets deploy stacks across multiple accounts and Regions from a central administrator account.',
                {
                  name: 'Troubleshooting Patterns',
                  text: 'Common issues: missing IAM permissions for CloudFormation service role, circular dependencies between resources, invalid references (!Ref to non-existent logical ID), or quota limits (for example, VPC CIDR exhaustion, EIP limits).'
                },
                {
                  name: 'Exam Mapping',
                  text: 'Directly maps to Skills 3.1.2 and 3.1.3: create/manage CloudFormation stacks and identify/remediate deployment issues such as subnet sizing, IAM/permission errors, and template syntax problems.'
                },
                {
                  name: 'Exam Pattern',
                  text: 'If the question says “roll out the same networking stack to multiple accounts and Regions with centralized control,” the answer is usually CloudFormation StackSets, not manual deployment or scripts.'
                }
              ],
              resources: [
                { name: 'CloudFormation Guide', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html' }
              ]
            },
            {
              topic: 'Template Components',
              details: [
                'Parameters: Input values for stacks (for example, environment, instance type, CIDR).',
                'Resources: AWS resources to create (must have unique logical IDs).',
                'Mappings: Static lookup tables (for example, Region → AMI ID).',
                'Conditions: Control whether resources/properties are created (for example, create NAT only in prod).',
                'Outputs: Values exported for use by other stacks or humans (for example, VPC ID, ALB DNS name).',
                'Metadata: Additional information for tools, such as CloudFormation Designer or helper scripts.',
                {
                  name: 'Example',
                  text: 'Typical exam pattern: parameterized VPC CIDR and instance types; mappings for Region-specific AMIs; conditions for enabling features only in production.'
                }
              ],
              resources: [
                { name: 'Template Anatomy', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html' }
              ]
            },
            {
              topic: 'Intrinsic Functions & Pseudo Parameters',
              details: [
                '!Ref: Reference parameters and resources (for example, `!Ref MySubnet`).',
                '!GetAtt: Get resource attributes (for example, `!GetAtt MyALB.DNSName`).',
                '!Sub: String substitution and embedding parameter/attribute values within strings.',
                '!Join: Concatenate values into a single string (for example, building ARNs or names).',
                '!Select and !Split: Choose elements from lists or split strings (useful with `Fn::GetAZs`).',
                '!If: Conditional values based on Conditions section.',
                '!FindInMap: Look up values from Mappings (for example, Region → AMI).',
                '!ImportValue: Import Outputs exported from other stacks (cross-stack references).',
                {
                  name: 'Pseudo Parameters',
                  text: 'Common ones: `AWS::Region`, `AWS::AccountId`, `AWS::StackName`, used to build ARNs or names without hardcoding environment-specific values.'
                },
                {
                  name: 'Exam Pattern',
                  text: 'Questions mentioning “reuse template across environments with different parameters (e.g., dev/prod) and environment-specific values” typically involve Parameters + Mappings + Conditions with intrinsic functions like `!Ref`, `!FindInMap`, `!If`, and `!Sub`.'
                }
              ],
              resources: [
                { name: 'Intrinsic Functions', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html' }
              ]
            },
            {
              topic: 'AWS CDK Basics (with CloudFormation under the hood)',
              details: [
                'AWS CDK: Define infrastructure in familiar programming languages (TypeScript, Python, Java, C#, etc.).',
                'CDK apps synthesize to CloudFormation templates (`cdk synth`), which are then deployed by CloudFormation.',
                'Constructs: L1 (CFN resources), L2 (opinionated high-level APIs), and L3 (patterns/solutions).',
                'Use context and environment variables to manage differences between stages (dev/test/prod).',
                {
                  name: 'CDK Example',
                  text: 'You define constructs (L2/L3) in code, run `cdk synth` to generate CloudFormation, then `cdk deploy` to create/update stacks. Exam keyword: “define infra in TypeScript/Python instead of YAML/JSON templates.”'
                },
                'Terraform is a popular third-party IaC tool that also manages AWS resources, using state files to track resource mappings.',
                {
                  name: 'Git & CI/CD',
                  text: 'Infrastructure repos typically live in Git (CodeCommit/GitHub/GitLab). You integrate with CodePipeline / CodeBuild / GitHub Actions to automatically validate and deploy CloudFormation/CDK/Terraform changes on commit.'
                },
                {
                  name: 'Exam Pattern',
                  text: 'If the question mentions “existing Terraform/IaC tooling” or “company standardizes on Terraform,” the answer is usually to integrate Terraform with IAM roles and use remote state (e.g., S3 + DynamoDB) instead of forcing migration to CloudFormation.'
                },
                {
                  name: 'Exam Pattern',
                  text: 'If the question mentions “infrastructure as code using TypeScript/Python” and CloudFormation templates produced automatically, the correct service is AWS CDK, but CloudFormation still performs the deployment.'
                }
              ],
              resources: [
                { name: 'AWS CDK', url: 'https://docs.aws.amazon.com/cdk/latest/guide/home.html' }
              ]
            }
          ]
        },
    
        {
          title: 'Images, AMIs, and Containers',
          content: [
            {
              topic: 'AMIs & EC2 Image Builder',
              details: [
                'An Amazon Machine Image (AMI) is a template that contains the software configuration (OS, application, dependencies) required to launch EC2 instances.',
                'Golden AMIs provide standardized, hardened images for consistent deployments across environments.',
                'EC2 Image Builder automates building, testing, and distributing AMIs on a schedule or triggered basis.',
                'Pipelines can include hardening, security scanning, and updating base OS and agents (for example, CloudWatch/SSM).',
                {
                  name: 'Example',
                  text: 'Use EC2 Image Builder to create a monthly patched web-server AMI and reference it in Auto Scaling launch templates so new instances always use the latest hardened image.'
                },
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skill 3.1.1: create and manage AMIs and automate image pipelines instead of manual instance baking.'
                },
                {
                  name: 'Pipeline Pattern',
                  text: 'Source image (e.g., Amazon Linux 2) -> Build component (install agents, app dependencies) -> Test component (run tests) -> Output AMI -> Distribute to multiple Regions/accounts.'
                },
                'You can share AMIs across accounts by modifying launch permissions or via AWS RAM in some scenarios.',
                {
                  name: 'Exam Pattern',
                  text: 'If you see “keep EC2 images patched and compliant across many accounts/Regions, reduce manual AMI creation”, the likely answer is EC2 Image Builder + distribution settings, not manual AMI creation from instances.'
                }
              ],
              resources: [
                { name: 'EC2 Image Builder', url: 'https://docs.aws.amazon.com/imagebuilder/latest/userguide/what-is-image-builder.html' }
              ]
            },
            {
              topic: 'Container Images & Amazon ECR',
              details: [
                'Amazon ECR is a fully managed container registry for storing Docker/OCI images.',
                'Supports private repositories with IAM-based access control and public repositories for public images.',
                'Lifecycle policies automatically expire old image versions to control storage cost.',
                'Image scanning (basic or enhanced) detects vulnerabilities in container images.',
                'Integrates directly with ECS, EKS, and Fargate for pulling images at deploy time.',
                'You can build images with CodeBuild, GitHub Actions, or local Docker and push to ECR for ECS/EKS/Fargate use.',
                {
                  name: 'Exam Pattern',
                  text: 'If the scenario mentions “store and version container images for ECS/EKS” with IAM-controlled access and vulnerability scanning, the correct answer is Amazon ECR.'
                },
                {
                  name: 'Example',
                  text: 'Use CodeBuild buildspec to run `docker build`, `docker tag`, and `docker push` to ECR on each commit; ECS service uses the latest tagged image in a rolling deployment.'
                },
                {
                  name: 'Exam Mapping',
                  text: 'Skill 3.1.1: “Create and manage AMIs and container images (for example, EC2 Image Builder)”—look for patterns around immutable infrastructure, golden images, and container registries like ECR.'
                }
              ],
              resources: [
                { name: 'Amazon ECR', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html' }
              ]
            }
          ]
        },
    
        {
          title: 'Multi-Account & Multi-Region Provisioning',
          content: [
            {
              topic: 'CloudFormation StackSets',
              details: [
                'Deploy CloudFormation stacks to multiple accounts and Regions from a central administrator account.',
                'CloudFormation StackSets deploy stacks automatically across multiple AWS accounts and Regions using delegated admin.',
                'Targets can be AWS accounts or entire AWS Organizations OUs (automatic inclusion of new accounts).',
                'Supports automatic deployment to new accounts in an OU, and automatic rollback on failure.',
                'Used for baseline infrastructure: IAM roles, Config rules, CloudTrail, logging buckets, guardrails.',
                {
                  name: 'Exam Pattern',
                  text: 'If you see “deploy the same stack to hundreds of accounts and Regions with centralized control”, the solution is CloudFormation StackSets (Skill 3.1.4).'
                },
                {
                  name: 'Example',
                  text: 'Use a StackSet to roll out a standardized VPC, Config rules, or CloudTrail trail to every account in an AWS Organization with one operation.'
                }
              ],
              resources: [
                { name: 'CloudFormation StackSets', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html' }
              ]
            },
            {
              topic: 'AWS Resource Access Manager (AWS RAM)',
              details: [
                'AWS Resource Access Manager (AWS RAM) shares resources (e.g., subnets, Transit Gateways, Route 53 Resolver rules, License Manager) across accounts without duplication.',
                {
                  name: 'Exam Pattern',
                  text: 'If the requirement says “central network account, application accounts consume shared subnets/Transit Gateway,” the answer is usually AWS RAM + shared VPC resources, not peering every account pair.'
                },
                'Share AWS resources across accounts and within AWS Organizations (for example, subnets, Route 53 Resolver rules, Transit Gateways, License Manager configs).',
                'Avoids duplicating shared infrastructure resources in every account (centralized networking design).',
                'Works with both individual account invitations and Organizations-based sharing.',
                {
                  name: 'Example',
                  text: 'Share a central VPC subnet or Transit Gateway with multiple workload accounts, so they can attach their VPCs without each account owning its own TGW.'
                },
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skill 3.1.4: provision and share resources across multiple Regions and accounts using AWS RAM instead of manual peering in every account.'
                }
              ],
              resources: [
                { name: 'AWS RAM', url: 'https://docs.aws.amazon.com/ram/latest/userguide/what-is.html' }
              ]
            }
          ]
        },
        {
          title: 'Deployment Strategies & Services',
          content: [
            {
              topic: 'Deployment Strategies & Elastic Beanstalk — Generic Deployment Strategies',
              details: [
                'All-at-once/In-place: deploy new version to all instances simultaneously; fastest but causes downtime and higher risk; suitable for dev/test. All instances in your environment are out of service for a short time while the deployment occurs. It updates the application version without replacing any infrastructure components, directly in a production environment. In-place deployments stop and start tasks on the same container instance. This strategy causes service interruptions during updates, while minimal, not acceptable for zero downtime requirements.',
                'Immutable: launch a new ASG with new version, test it, then switch traffic; safer and easier rollback (replace ASG). It deploys new version to a new set of instances in a new ASG, then swaps over; minimizes risk.',
                'Blue/Green: maintain two environments (blue=prod, green=new); switch traffic using Route 53 or ALB/Target-group switch. create a separate environment with the new version and use Route 53 URL or CNAME swap to cut over. These deployments provide releases with near zero-downtime and rollback capabilities. The fundamental idea behind blue/green deployment is to shift traffic between two identical environments that are running different versions of your application.',
                {
                  name: 'Exam Pattern',
                  text: 'If the requirement is “zero downtime, easy rollback,” the best answer is usually immutable or blue/green deployments rather than all-at-once.'
                },
                'Canary deployments: a type of blue/green deployment strategy that is more risk-averse. This strategy involves a phased approach in which traffic is shifted to a new version of the application in two increments. The first increment is a small percentage of the traffic, which is referred to as the canary group. This group is used to test the new version, and if it is successful, the traffic is shifted to the new version in the second increment. Canary deployments can be implemented in two steps or linearly. In the two-step approach, the new application code is deployed and exposed for trial. Upon acceptance, it is rolled out either to the rest of the environment or in a linear fashion. The linear approach involves incrementally increasing traffic to the new version of the application until all traffic flows to the new release.',
                'Rolling: generally faster than a blue/green deployment; however, unlike a blue/green deployment, in a rolling deployment there is no environment isolation between the old and new application versions, it can temporarily mix old/new versions. It updates in batches, maintains some capacity but may temporarily reduce total capacity. A deployment strategy that slowly replaces previous versions of an application with new versions of an application by completely replacing the infrastructure on which the application is running.',
                'Rolling with additional batch: temporarily launches extra instances so you maintain full capacity during deployment/rollout.',
                'Traffic splitting: send a small percentage of traffic to the new version for canary testing before full rollout.',
                {
                  name: 'Exam Mapping',
                  text: 'Skill 3.1.5: “Implement deployment strategies and services.” Beanstalk naming (All-at-once, Rolling, Immutable, Blue/Green) often appears in scenario questions about downtime vs risk and rollback.'
                }
              ],
              image: {
                url: 'https://docs.aws.amazon.com/images/whitepapers/latest/blue-green-deployments/images/blue-green-example.png',
                alt: 'Blue/green deployment'
              },
              resources: [
                { name: 'Deployment Options', url: 'https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html' }
              ]
            },
            {
              topic: 'CodeDeploy & Application Deployment Strategies',
              details: [
                'Supports in-place and blue/green deployments for EC2/On-Prem and ECS services.',
                'Deployment groups define which instances or services receive updates.',
                'Hooks/lifecycle events (for example, `BeforeInstall`, `AfterInstall`, `BeforeAllowTraffic`) run scripts for validation, migration, or rollback.',
                'Traffic shifting options (for example, linear, canary, all-at-once) for blue/green deployments via ALB or Route 53.',
                {
                  name: 'Exam Pattern',
                  text: 'If the question mentions “automated rollback when health checks fail during deployment” for EC2/ECS, CodeDeploy with blue/green and health checks is the expected answer.'
                }
              ],
              resources: [
                { name: 'CodeDeploy', url: 'https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html' }
              ]
            },
            {
              topic: 'Lambda & Weighted Routing for Deployments',
              details: [
                'Lambda aliases (for example, `prod`, `beta`) can point to different versions of a function.',
                'Traffic shifting between versions/aliases supports canary or linear rollout (for example, 10% → 50% → 100%).',
                'Route 53 and ALB can use weighted routing to gradually shift traffic between two environments (blue/green pattern).',
                {
                  name: 'Exam Pattern',
                  text: 'Look for phrases like “shift 5% of traffic to the new version and automatically roll back if errors spike” – solved with Lambda aliases or weighted routing in Route 53/ALB.'
                }
              ]
            },
            {
              topic: 'Third-Party IaC Tools (Terraform, Git, etc.)',
              details: [
                'Terraform: popular third-party IaC tool that manages resources by calling AWS APIs; state stored remotely (for example, S3 + DynamoDB).',
                'Git-based workflows: store infrastructure code (CloudFormation, CDK, Terraform) in Git and trigger CI/CD pipelines on commits.',
                {
                  name: 'Exam Mapping',
                  text: 'Skill 3.1.6: recognise that Terraform/Git can be used to automate resource deployment, but AWS-native services (CloudFormation/CDK/CodePipeline) remain preferred in exam scenarios unless question explicitly mentions third-party tools.'
                }
              ]
            }
          ]
        },
        {
          title: 'Systems Manager & Operational Automation',
          content: [
            {
              topic: 'Systems Manager Run Command',
              details: [
                'Run Command executes shell/PowerShell commands on EC2/on-premises instances without SSH/RDP or open inbound ports.',
                'Ideal for ad-hoc operations (for example, restart services, apply config changes, collect logs).',
                'Supports rate controls, concurrency limits, and error thresholds when targeting large fleets.',
                'Can send command output to S3 and CloudWatch Logs for auditing and troubleshooting.',
                'Access controlled with IAM, enabling fine-grained control over which users can run which commands.',
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skill 3.2.1: use AWS Systems Manager to automate operational processes on existing resources without opening inbound ports.'
                },
                {
                  name: 'Exam Pattern',
                  text: 'If you see “run a script on hundreds of instances in multiple Regions, without opening SSH and with audit logs,” the correct answer is Systems Manager Run Command.'
                }
              ],
              resources: [
                { name: 'Run Command', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html' }
              ]
            },
            {
              topic: 'Automation Documents (SSM Runbooks)',
              details: [
                'Automation documents (runbooks) define multi-step workflows (for example, stop instance, snapshot EBS, start instance).',
                'AWS provides many predefined runbooks, and you can create custom ones in JSON/YAML.',
                'Support approvals, rate control, and integrations with Lambda, SNS, and EventBridge.',
                'Can run across accounts and Regions when properly configured.',
                'Can be triggered manually, on a schedule (Maintenance Windows), or programmatically (EventBridge, Lambda, SDK).',
                {
                  name: 'Exam Mapping',
                  text: 'Skill 3.2.1: “Use AWS services to automate operational processes.” Automation runbooks are a common answer when you need standardized remediation/maintenance across fleets (snapshot, patch, restart, collect logs).'
                },
                {
                  name: 'Pattern',
                  text: 'EventBridge rule -> SSM Automation runbook to remediate drift or perform routine tasks (for example, restart unhealthy instance, attach IAM role, rotate logs).'
                },
                {
                  name: 'Exam Mapping',
                  text: 'Maps to Skills 3.2.1 and 3.2.2: automate management of existing resources and trigger automation based on events.'
                }
              ],
              resources: [
                { name: 'Systems Manager Automation', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html' }
              ]
            }
          ]
        },
        {
          title: 'Event-Driven Automation (Lambda, S3, EventBridge)',
          content: [
            {
              topic: 'Event-Driven Automation (Lambda, S3 Events, EventBridge)',
              details: [
                'Lambda + S3 Event Notifications: trigger functions on object creation/deletion (e.g., resize images, process logs, move files).',
                'Lambda + CloudWatch Logs subscriptions: near real-time log processing and alerting based on patterns.',
                'S3 can emit events (for example, `s3:ObjectCreated:*`, `s3:ObjectRemoved:*`) to Lambda, SNS, or SQS.',
                'Common pattern: S3 upload → Lambda function to process/transform files or update metadata.',
                'Use dead-letter queues (DLQs) or on-failure destinations for failed Lambda invocations.',
                {
                  name: 'Exam Pattern',
                  text: 'Maps to Skill 3.2.2: “When an object is uploaded to an S3 bucket, automatically process it” – configure S3 event notification to trigger a Lambda function or send to SQS/SNS.'
                },
                {
                  name: 'Exam Mapping',
                  text: 'Skill 3.2.2: “Implement event-driven automation by using AWS services and features (for example, Lambda, S3 Event Notifications).” Look for keywords like “trigger automatically when X happens” or “serverless event-driven processing.”'
                }
              ],
              resources: [
                { name: 'S3 Event Notifications', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/NotificationHowTo.html' }
              ]
            },
            {
              topic: 'EventBridge for Operational Automation',
              details: [
                'EventBridge rules match events from AWS services, custom apps, and SaaS partners and route them to targets (Lambda, SQS, SNS, Step Functions, SSM Automation, and more).',
                'Supports scheduled events (cron/rate) for time-based automation (for example, nightly cleanup jobs).',
                'Enables centralized event-driven automation across multiple accounts using event buses and cross-account rules.',
                {
                  name: 'Pattern',
                  text: '“When a new object is uploaded to S3, automatically process and store metadata in DynamoDB” → S3 Event Notification → Lambda → DynamoDB (or EventBridge → Lambda).'
                },
                {
                  name: 'Exam Mapping',
                  text: 'Skill 3.2.2: implement event-driven automation, for example “trigger SSM Automation when an EC2 instance becomes unhealthy” using EventBridge + SSM runbook.'
                }
              ],
              resources: [
                { name: 'EventBridge', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/what-is-amazon-eventbridge.html' }
              ]
            }
          ]
        },
        {
          title: 'Troubleshooting Provisioning & Deployment',
          content: [
            {
              topic: 'Common CloudFormation & Networking Issues',
              details: [
                'Subnet sizing issues: too-small CIDR blocks cause IP exhaustion and failed instance launches.',
                'Incorrect subnet type: launching public resources (e.g., ALB) in private subnets without an Internet Gateway leads to unreachable endpoints.',
                'Dependency/order issues: resources failing because required IAM roles, security groups, or subnets are not defined correctly in the template.',
                'Rollbacks on failure: CloudFormation automatically rolls back the stack if a resource creation/update fails, unless disabled.',
                {
                  name: 'Exam Pattern',
                  text: 'Questions about “stack stuck in ROLLBACK_COMPLETE” or failures referencing missing IAM permissions often test your ability to identify misconfigured IAM roles/policies or missing capabilities like `CAPABILITY_NAMED_IAM` for IAM changes.'
                }
              ]
            },
            {
              topic: 'Permissions & IAM Issues in Deployments',
              details: [
                'CloudFormation needs IAM permissions to create/update/delete resources; insufficient permissions cause stack failures.',
                'IAM roles for service principals (e.g., CodeBuild, CodePipeline, EC2, Lambda) must allow required actions on target resources.',
                'Cross-account deployments require trust relationships and appropriate role assumptions (e.g., StackSets with delegated admin).',
                {
                  name: 'Example',
                  text: 'A deployment pipeline fails to create an S3 bucket because the CodePipeline service role lacks `s3:CreateBucket` permission; fixing the IAM policy resolves the issue.'
                }
                ]
              }
            ]
          }
        ]
      },
    security: {
      title: 'Domain 4: Security and Compliance (16%)',
      sections: [
        {
          title: 'IAM & Access Management',
          content: [
            {
              topic: 'Policies',
              details: [
                'Identity-based: Attached to users/groups/roles',
                'Resource-based: Attached to resources (e.g., S3 bucket policy, SNS topic policy)',
                'AWS managed vs Customer managed',
                'Policy evaluation: Explicit Deny > Allow',
                'Permission boundaries to cap maximum permissions for an identity',
                {name: 'Service Control Policies (SCPs)', text: "SCPs in AWS Organizations enforce guardrails (managing permissions) across accounts. SCPs help you to ensure your accounts stay within your organization’s access control guidelines. They define a permission guardrail, or sets limits, on the actions that the IAM users and IAM roles in your organization can perform. SCPs do not grant permissions to the IAM users and IAM roles in your organization."},
                {
                  name: 'Best Practice',
                  text: 'Grant least-privilege by default; start broad, then refine. ([docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html))'
                }
              ],
              resources: [
                { name: 'IAM Policies Guide', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html' }
              ]
            },
            {
              topic: 'Roles & Federation',
              details: [
                'Use roles (rather than long-lived user credentials) for applications, services, and cross-account access. ([docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html))',
                'EC2 instance profiles – attach a role to EC2 so the instance gets temporary credentials',
                'Cross-account role trust: external accounts assume role via sts:AssumeRole',
                'Federated identity (SAML / OIDC) for corporate IdP access without separate IAM users',
                'External ID for third-party cross-account role access',
                'Session policies can further limit role permissions at session time',
                {
                  name: 'Exam Pattern',
                  text: 'If the question mentions “no long-term access keys, must use federation or assume role”, the correct answer is IAM roles/federation.'
                }
              ],
              resources: [
                { name: 'IAM Roles Guide', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html' }
              ]
            },
            {
              topic: 'Access Troubleshooting & Audit',
              details: [
                'Use IAM Access Analyzer to detect unused roles, public crosses-account access, and generate least-privilege policies. ([docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html))',
                'Use policy simulator to test policy effect before deploying.',
                'Use AWS CloudTrail to log API calls: who, what, when, where.',
                'Typical failure causes: missing sts:AssumeRole trust, missing iam:PassRole permission, incorrect resource ARN in policy.',
                {
                  name: 'Exam Mapping',
                  text: 'If “access denied despite policy looks correct” → check role trust, resource/conditions, policy chaining.'
                }
              ],
              resources: [
                { name: 'CloudTrail User Guide', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html' }
              ]
            },
            {
              topic: 'Multi-Account Strategy & Governance',
              details: [
                'Define account structure: Management (billing/security), Shared Services (logging/networking), Workload (dev/test/prod).',
                'Use AWS Organizations OUs + SCPs to enforce region/service restrictions and permissions across accounts. ([aws.amazon.com/blogs/mt/best-practices-to-respond-to-security-risks-across-your-aws-organizations](https://aws.amazon.com/blogs/mt/best-practices-to-respond-to-security-risks-across-your-aws-organizations/))',
                'Use a central Security account for aggregated logs (CloudTrail, Config, GuardDuty) and remediation.',
                'Enable CloudTrail org-trail and centralized logging for all accounts.',
                {
                  name: 'Exam Pattern',
                  text: 'Question: “Which account should hold root keys or manage security tooling?” → The Management/Security tooling account, not workload/prod.'
                }
              ],
              resources: [
                { name: 'AWS Organizations Overview', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html' }
              ]
            }
          ]
        },
        {
          title: 'Data & Infrastructure Protection',
          content: [
            {
              topic: 'Encryption at Rest',
              details: [
                'Use AWS Key Management Service (KMS) to create/manage CMKs, enable automatic key rotation, monitor usage via CloudTrail. ([docs.aws.amazon.com/kms/latest/developerguide/overview.html](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html))',
                'S3: SSE-S3, SSE-KMS, SSE-C (customer-provided key)',
                'EBS: enable “Encryption by default” or use custom CMK; snapshots inherit encryption. ([docs.aws.amazon.com/kms/latest/developerguide/concepts.html](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html))',
                'RDS: Encryption at DB creation time only (most engines)',
                'EFS: Encryption at creation time; use KMS key for encryption-at-rest.',
                {
                  name: 'Best Practice',
                  text: 'Design key policies to limit kms:CreateKey, specify resource ARNs instead of wildcard “*”. ([docs.aws.amazon.com/kms/latest/developerguide/iam-policies-best-practices.html](https://docs.aws.amazon.com/kms/latest/developerguide/iam-policies-best-practices.html))'
                }
              ],
              resources: [
                { name: 'KMS Developer Guide', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/overview.html' }
              ]
            },
            {
              topic: 'Encryption in Transit & Secure Connectivity',
              details: [
                'Use AWS Certificate Manager (ACM) to provision/rotate public and private TLS/SSL certificates automatically.',
                'HTTPS on API endpoints, ALB/ELB, CloudFront; enforce TLS 1.2+.',
                'Use Site-to-Site VPN or AWS Direct Connect with encryption for on-premises connectivity.',
                'Use VPC Endpoints/PrivateLink to avoid internet path and keep traffic in AWS backbone.',
                {
                  name: 'Exam Pattern',
                  text: 'If question mentions “secure object upload across accounts without public internet” → use VPC endpoint + encryption + ACM certificate.'
                }
              ],
              resources: [
                { name: 'ACM User Guide', url: 'https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html' }
              ]
            },
            {
              topic: 'Secrets Management',
              details: [
                'Use AWS Secrets Manager to securely store, rotate, and manage secrets (DB credentials, API keys) rather than embedding in code/config.',
                'Use SSM Parameter Store (SecureString) as lightweight alternative, encrypted with KMS.',
                'Avoid hard-coding credentials; implement automated rotation where supported.',
                {
                  name: 'Exam Mapping',
                  text: 'Question: “Which service supports automatic rotation of DB credentials with RDS?” → Secrets Manager.'
                }
              ],
              resources: [
                { name: 'AWS Secrets Manager', url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html' }
              ]
            }
          ]
        },
        {
          title: 'Compliance, Audit & Remediation',
          content: [
            {
              topic: 'Configuration & Monitoring',
              details: [
                'Use AWS Config to record resource configuration, evaluate compliance rules, and trigger remediation actions. ([docs.aws.amazon.com/config/latest/developerguide/security-best-practices.html](https://docs.aws.amazon.com/config/latest/developerguide/security-best-practices.html))',
                'Enable Config Aggregator to monitor multiple accounts/regions.',
                'Use AWS Security Hub to aggregate findings from GuardDuty, Inspector, Config, etc, and enable automated remediation. ([aws.amazon.com/blogs/security/optimize-aws-config-for-aws-security-hub-to-effectively-manage-your-cloud-security-posture/](https://aws.amazon.com/blogs/security/optimize-aws-config-for-aws-security-hub-to-effectively-manage-your-cloud-security-posture/))',
                {
                  name: 'Exam Pattern',
                  text: 'If you see “automated remediation when non-compliant resource found” → Config rule + EventBridge + SSM Automation runbook is typical.'
                }
              ],
              resources: [
                { name: 'AWS Config Guide', url: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html' }
              ]
            },
            {
              topic: 'Logging & Forensics',
              details: [
                'Enable CloudTrail trails in all accounts/regions; send logs to central S3 bucket; enable log-file integrity validation.',
                'Enable data-events (S3 object level, Lambda function invocation) for deeper visibility.',
                'Use S3 Lifecycle to archive logs (e.g., 7 years) to meet compliance/regulatory needs.',
                {
                  name: 'Exam Pattern',
                  text: 'If question: “Which user deleted resource X at 3am?” → query CloudTrail or use Athena over S3 logs.'
                }
              ],
              resources: [
                { name: 'CloudTrail User Guide', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html' }
              ]
            },
            {
              topic: 'Remediation & Governance',
              details: [
                'Use AWS Trusted Advisor Security checks (e.g., root account access keys, MFA disabled) and automate remediation via SSM Automation or Lambda triggered from EventBridge.',
                'Tag-based governance: e.g., `DataSensitivity=PII` triggers stricter IAM policies, encryption-at-rest, and separate logging account.',
                {
                  name: 'Exam Mapping',
                  text: 'If requirement: “Enforce region/ service restriction across org” → AWS Organizations + SCPs + Config rule.'
                }
              ],
              resources: [
                { name: 'AWS Security Hub Best Practices', url: 'https://aws.github.io/aws-security-services-best-practices/guides/security-hub/' }
              ]
            }
          ]
        }
      ]
    },

    
    networking: {
      title: 'Domain 5: Networking and Content Delivery (18%)',
      sections: [
        {
          title: 'VPC',
          content: [
            {
              topic: 'Subnets & Routing',
              details: [
                { name: 'VPC', text: "A secure, isolated, private network hosted on a public cloud, closely resembles a traditional network that you would operate in your own data center. After you create a VPC, you can add subnets. Each VPC is confined to a single region." },
                { name: 'Subnet', text: "A range of IP addresses in your VPC. A subnet must reside in a single Availability Zone. After you add subnets, you can deploy AWS resources in your VPC. Each subnet in a VPC is confined to a single AZ." },
                'Default limit: The default limit is five VPCs per region',
                'Adjustable limit: You can request a quota increase from AWS to have more VPCs per region.',
                'ENI: An Elastic Network Interface (ENI) is a logical networking component in a VPC that enables network connectivity within a VPC. It can be dynamically attached to and detached from cloud instances (like AWS EC2 instances), allowing its network properties, such as private and public IP addresses, security groups, and MAC address, to be retained. This decoupling of network configuration from the instance allows for high availability through failover, multi-IP server configurations, and segmented network traffic.',
                'CIDR blocks: /16 to /28',
                'Public subnet: Route to IGW',
                'Private subnet: Route to NAT',
                'Route table priority: Most specific',
                'Local route: Cannot be deleted',
                'VPC Peering: No transitive routing',
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
              topic: 'Secure your VPC: BPA, Security Groups & NACLs',
              details: [
                {name:'VPC Block Public Access (BPA)', text: 'VPC BPA is a centralized security feature that enables you to authoritatively prevent public internet access to VPC resources across an entire AWS account, ensuring compliance with security requirements while providing flexibility for specific exceptions and audit capabilities. The VPC BPA feature has the following modes:. Bidirectional: All traffic to and from internet gateways and egress-only internet gateways in this Region (except for excluded VPCs and subnets) is blocked. Ingress-only: All internet traffic to the VPCs in this Region (except for VPCs or subnets which are excluded) is blocked. Only traffic to and from NAT gateways and egress-only internet gateways is allowed because these gateways only allow outbound connections to be established.'},
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
              topic: 'VPC Connectivity & Gateways',
              details: [
                { name: 'Internet Gateway', text: 'a horizontally scaled, redundant, and highly available VPC component that allows bidirectional communication between your VPC and the internet. It supports IPv4 and IPv6 traffic. It does not cause availability risks or bandwidth constraints on your network traffic.' },
                { name: 'NAT Gateway', text: 'it enables **private subnet instances to connect to internet, other VPCs, on-premises networks**; handles IPv4, IPv6 traffic routing, connectivity types. If you aim **to provide Internet access to private instances, the NAT gateway must be located in a public subnet**.' },
                { name: 'VPC Endpoints', text: 'Private AWS access - Interface Endpoints enable connectivity to a wide range of services, while Gateway Endpoints are specifically designed for routing traffic to Amazon S3 and DynamoDB.' },
                { name: 'Gateway VPC Endpoint', text: 'A gateway VPC endpoint for Amazon S3 provides direct private connectivity between your VPC and Amazon S3. This solution eliminates data transfer costs. Gateway endpoints are free to use. Gateway endpoints allow EC2 instances in private subnets to access Amazon S3 without using the internet or incurring data processing charges.' },
                { name: 'Amazon S3 Transfer Acceleration', text: 'S3 Transfer Acceleration is a bucket-level feature that you can use to improve transfer speeds over long distances. S3 Transfer Acceleration would increase costs by adding acceleration fees to the existing data transfer costs. This solution can improve transfer speeds. However, this solution does not eliminate data transfer costs.' },
                { name: 'S3 File Gateway', text: 'It provides a file interface into Amazon S3. You can use S3 File Gateway to store and retrieve objects in Amazon S3 by using file protocols such as NFS and SMB. This solution requires you to set up and manage a gateway instance. This solution still incurs data transfer charges.' },
                { name: 'VPN', text: 'IPSec encrypted tunnel' },
                { name: 'Direct Connect', text: 'a service establishes a dedicated connection that delivers consistent, low-latency performance from an on-premises network to one or more VPCs' },
                { name: 'Transit Gateway', text: "Amazon S3 Transfer Acceleration is a service that speeds up long-distance data transfers to and from an Amazon S3 bucket by routing traffic through Amazon CloudFront's globally distributed edge locations and using the AWS global backbone network. This improves performance by reducing the impact of internet congestion and distance, which can be particularly beneficial for applications with geographically dispersed users or for transferring large objects. To use it, you must enable the feature on your S3 bucket and then access it using a specific accelerated endpoint" },
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
                { name: 'Connection Error Types', text: '`500` - a generic, client-side message indicating that the website server encountered an unexpected problem and cannot fulfill the request —> this is a server-side issue, not a problem with the browser, computer, or internet connection of the user. `501` - `Not Implemented` means the server does not support the specific functionality needed to fulfill a request. `502` - `Bad Gateway` server error response status code indicates that a server was acting as a gateway or proxy and that it received an invalid response. `503` - `Service Unavailable` error, which means a server is temporarily unable to handle a request, meaning for ALBs that the target groups for the load balancer have no registered targets, or all of the registered targets are in an unused state. `504` - a gateway timeout, a server-side error that occurs when a server acting as a gateway or proxy does not receive a timely response from an upstream server needed to complete a request.' },
                'ALB: Layer 7, for HTTP/HTTPS traffic, offering host-based or path routing',
                { name: 'Example', text: 'An ALB is suitable for the web tier because ALBs support layer 7 routing and HTTP health checks on specific paths.' },
                'You can use ALBs to distribute incoming HTTP traffic across targets. ALBs cannot route traffic based on instance CPU utilization, that is something Auto Scaling Groups can track.',
                'NLB: Layer 4, for TCP/UDP/TLS traffic, providing high-performance, low-latency, and supports static IPs',
                { name: 'Example', text: 'An NLB is suitable for the API tier because an NLB performs load balancing at layer 4 and supports TCP health checks on a specific port. Additionally, an NLB can handle the millions of requests that the API tier requires.' },
                'CLB: Legacy, avoid for new apps',
                'GWLB: Layer 3, for deployment and management of a fleet of virtual network appliances like firewalls',
                'Cross-zone load balancing: a feature within these services that distributes traffic evenly across all enabled Availability Zones (AZs), improving availability and reliability',
                'Connection draining/deregistration delay: a feature of AWS Elastic Load Balancing (ELB) that allows in-flight requests to complete before an instance is terminated or removed. The load balancer stops sending new requests to the instance while it waits for the configured deregistration delay (default 300 seconds) to expire or for all requests to finish'
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
          title: 'Routing',
          content: [
            {
              topic: 'Main Routing and Web Hosting concepts',
              details: [
                { name: 'Route 53', text: 'Amazon Route 53 is a highly available and scalable cloud domain name system (DNS) service that registers domain names and translates human-readable domain names into IP addresses to route internet traffic. Enables to customize DNS routing policies to reduce latency.' },
                'It acts like a phone book for the internet, connecting domain names (like www.example.com) to their corresponding IP addresses (like 192.0.2.1). The name "53" refers to port 53, the standard TCP and UDP port used for DNS requests.',
                'A records are another type of DNS record that point a domain name directly to an IP address. In short, a CNAME points to another name, while an A record points to an IP address, and DNS is the technology that manages all these different record types. ',
                'DNS is the overall system that translates domain names into IP addresses, while CNAME is a specific type of DNS record that creates an alias, pointing one domain name to another.',
              ],
              table: {
                title: 'Comparison',
                headers: ["Feature", "DNS", "CNAME", "A Record", "MX Record", "TXT Record"],
                rows: [
                  ["Function", "The overall system for name resolution", "Creates an alias from one domain to another", "Points a domain name to an IP address (IPv4)", "Specifies the mail servers for a domain", "Stores text strings or machine-readable data in DNS"],
                  ["Purpose", "Translates domain names into IP addresses", "Redirects traffic or uses a nickname for a service", "Connects a domain directly to a server’s IP address", "Directs email traffic to the appropriate mail exchange servers", "Used for domain verification, email authentication, and miscellaneous metadata"],
                  ["Example", "www.google.com → 142.250.184.142", "www.example.com (alias) → example.com (CNAME) or blog.example.com (alias) → shop.example.com (CNAME)", "example.com → 192.0.2.1", "example.com MX 10 mail1.example.net, MX 20 mail2.example.net", "example.com TXT \"v=spf1 include:_spf.example.com ~all\""],
                  ["Relationship to others", "Contains all record types (A, CNAME, MX, TXT, etc)", "Points to a canonical name, which is then resolved via an A/AAAA record", "Points to the final IP address that the browser or client will connect to", "Works together with A/AAAA of the mail servers; must point to a hostname (not a CNAME) per DNS spec", "Often complements MX records or other records; clients read TXT for policies/verification"],
                  ["Use case", "Any website or online service requiring name resolution", "When you want multiple names/aliases to point to a single canonical domain", "When you have a stable IPv4 address and want direct control over it", "When you host email for the domain and need prioritized mail servers", "When you must configure domain ownership validation, email sender policy (SPF), DKIM, or other metadata"]
                ]
              },
              resources: [
                { name: 'What is Amazon Route 53?', url: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html' }
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
    }
  };

  const practiceQuestions = [
    {
      id: 1,
      domain: 'Question 1',
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
      domain: 'Question 2',
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
      domain: 'Question 3',
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
      domain: 'Question 4',
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
      domain: 'Question 5',
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
      domain: 'Question 6',
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
      domain: 'Question 7',
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
      domain: 'Question 8',
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
      domain: 'Question 9',
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
      domain: 'Question 10',
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
      domain: 'Question 11',
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
  domain: 'Question 12',
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
  domain: 'Question 13',
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
  domain: 'Question 14',
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
  domain: 'Question 15',
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
  domain: 'Question 16',
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
  domain: 'Question 17',
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
  domain: 'Question 18',
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
  domain: 'Question 19',
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
  domain: 'Question 20',
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
  domain: 'Question 21',
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
  domain: 'Question 22',
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
    domain: 'Question 23',
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
    domain: 'Question 24',
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
    domain: 'Question 25',
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
    domain: 'Question 26',
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
    domain: 'Question 27',
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
    domain: 'Question 28',
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
    domain: 'Question 29',
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
    domain: 'Question 30',
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
    domain: 'Question 31',
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
    domain: 'Question 32',
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
    domain: 'Question 33',
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
    domain: 'Question 34',
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
  },
  {
    id: 35,
    domain: 'Question 35',
    question: 'A company runs a web application on an Auto Scaling group of Amazon EC2 instances behind an Application Load Balancer (ALB). Amazon CloudWatch metrics show high CPU utilization on the instances during peak hours. The high CPU utilization leads to an increased number of 503 errors. Which action will resolve high CPU utilization in the MOST cost-effective way?',
    options: [
      "Configure a target tracking scaling policy based on average CPU utilization.",
      "Modify the launch template to use a larger instance type with more CPU power.",
      "Disable scaling policies. Set the Auto Scaling group size to a fixed number of instances.",
      "Configure the ALB to route more traffic to instances with available CPU capacity during peak hours.",
    ],
    correct: 0,
    explanation: 'A target tracking scaling policy based on average CPU utilization will automatically adjust the number of instances in the Auto Scaling group based on the actual workload. This solution optimizes compute resources by scaling out when CPU utilization is high and scaling in when CPU utilization is low. This action will resolve the high CPU utilization during peak hours in a cost-effective way. You pay for increased CPU resources only during peak hours.'
  },
  {
    id: 36,
    domain: 'Question 36',
    question: 'A company uses Amazon CloudWatch to monitor Amazon EC2 instances. The company uses AWS Systems Manager Automation to remediate findings for EC2 instances. The company wants to automatically run a custom runbook whenever a specific CloudWatch alarm is invoked. Which solution will meet this requirement with the LEAST operational overhead?',
    options: [
      "Create an Amazon EventBridge rule that matches the alarm state change event pattern for the specific CloudWatch alarm. Configure the rule to invoke the custom runbook as a target.",
      "Create a custom AWS Config rule that produces a compliance change event if the CloudWatch alarm changes state. Configure AWS Config to directly invoke the custom runbook to automatically remediate the change event.",
      "Adjust the configuration of the CloudWatch alarm to send notifications to an Amazon Simple Notification Service (Amazon SNS) topic whenever the alarm changes state. Create an SNS subscription within Automation to invoke the custom runbook.",
      "Create an AWS Lambda function that is invoked by changes to the CloudWatch alarm state. Configure the Lambda function to invoke the custom runbook.",
    ],
    correct: 0,
    explanation: 'You can use EventBridge to match alarm state change events and to invoke a runbook as a target. EventBridge can monitor CloudWatch alarm state changes through event patterns. EventBridge can directly invoke Automation runbooks as targets. This solution provides a serverless and automated way to execute remediation actions when specific alarms are invoked. This solution does not require the management of custom code. Why the others are wrong? B: AWS Config can monitor for configuration changes. AWS Config can trigger notifications or auto-remediations. However, AWS Config cannot respond to changes in the CloudWatch alarm state. C: Amazon SNS is a fully managed message delivery service. Amazon SNS is useful for fan-out notifications. Lambda, Amazon Simple Queue Service (Amazon SQS), and email addresses can directly subscribe to Amazon SNS. However, Automation cannot create subscriptions to Amazon SNS directly. For this solution, you would need to write a Lambda function that subscribes to the SNS topic and invokes a run of the custom runbook. This custom configuration requires additional operational overhead. D: Lambda runs serverless code. You can use Lambda to respond to events. CloudWatch alarms can invoke Lambda functions. However, adding an intermediary Lambda function introduces unnecessary complexity. This solution requires additional operational overhead to manage and maintain custom code.'
  },
  {
    id: 37,
    domain: 'Question 36',
    question: 'A company is hosting applications on Amazon EC2 instances. The company stores data in Amazon RDS databases. The company wants to monitor key metrics and receive alarm notifications for the EC2 instances and RDS databases. Which solution will meet these requirements with the LEAST operational overhead?',
    options: [
      "Configure Amazon CloudWatch to monitor metrics for the EC2 instances and RDS databases. Create CloudWatch alarms that invoke based on metric thresholds for the EC2 instances and RDS databases.",
      "Use AWS CloudTrail to monitor API calls to the EC2 instances and RDS databases. Configure Amazon CloudWatch Logs to send logs to Amazon S3 for long-term storage.",
      "Deploy AWS Lambda functions to collect metrics from the EC2 instances and RDS databases. Publish the metrics to Amazon Data Firehose for storage and analysis in Amazon Redshift.",
      "Install the AWS Systems Manager Agent (SSM Agent) on the EC2 instances. Use Systems Manager to monitor and collect metrics from the EC2 instances and RDS databases.",
    ],
    correct: 0,
    explanation: 'CloudWatch can collect and track metrics for AWS services, including EC2 instances and RDS databases. You can configure CloudWatch alarms to be invoked when metrics exceed specified thresholds. This solution provides automated monitoring and notification capabilities. This solution requires minimal setup and maintenance. B Incorrect: CloudTrail tracks API activity. CloudTrail is not designed to monitor metrics. CloudTrail can be useful for security and auditing purposes. However, CloudTrail does not provide the metric monitoring and alarm capabilities that you need for this scenario. C Incorrect: Lambda functions can collect metrics from EC2 instances and RDS databases. However, using Lambda to collect metrics would require custom development and maintenance. Firehose can load streaming data into Amazon Redshift for analysis. However, this solution introduces additional operational overhead and complexity for metric monitoring and alerting. Amazon Redshift is a data warehouse that is more suitable for complex analytical queries on large datasets. Amazon Redshift is not suitable for real-time metric monitoring and alerting. You can use Systems Manager to manage EC2 instances. The SSM Agent can collect metrics from EC2 instances. However, the SSM Agent cannot directly monitor RDS databases.'
  },
  {
    id: 38,
    domain: 'Question 38',
    question: 'A company uses AWS CloudFormation StackSets to provision resources across multiple AWS accounts in AWS Organizations. The company wants to detect any manual changes to the resources that StackSets provisions. Which solution will meet these requirements with the LEAST operational effort?',
    options: [
      "Use AWS CloudTrail to monitor the changes that are made to the stacks.",
      "Configure a service control policy (SCP) that prevents changes to StackSets.",
      "Run CloudFormation drift detection on all stack sets at regular intervals.",
      "Use CloudFormation hooks to detect changes that are made to StackSets.",
    ],
    correct: 2,
    explanation: 'Drift detection is a feature that you can run on StackSets. Drift detection determines if any of the stack instances within a stack set are different from the original configuration. Drift detection on CloudFormation StackSets can detect the changes that are made to StackSets outside of the normal update process. This solution requires the least operational overhead. The feature can perform the drift detection on the StackSets with minimal intervention. You can use SCPs to control actions at various levels. SCPs do not integrate with StackSets to prevent changes or to detect drift. This solution would require significant operational effort to keep the SCPs in sync with stack set deployments.  You can use CloudFormation hooks to perform custom validations before you provision resources. CloudFormation hooks do not detect any manual changes to the resources that StackSets provisions. CloudTrail records the actions that are taken in an AWS account. CloudTrail can record the required activities. However, this solution requires complex filtering to find the events that relate to the changes of resources for a given stack set. This solution requires significant operational effort to meet the requirements.'
  },
  {
    id: 39,
    domain: 'Networking and Content Delivery ',
    question: 'A CloudOps engineer must block inbound traffic from the internet to a VPC. The VPC has been configured with bidirectional internet access by using an attached internet gateway and NAT gateways in public subnets. Which solution will meet these requirements with the LEAST operational overhead?',
    options: [
      "Set VPC Block Public Access (BPA) to ingress-only mode.",
      "Add a NAT gateway VPC security group inbound rule to deny traffic from 0.0.0.0/0.",
      "Replace the internet gateway with an egress-only internet gateway.",
      "Delete the VPC default security group inbound rule that allows traffic from 0.0.0.0/0.",
    ],
    correct: 0,
    explanation: "VPC BPA is a security feature that you can use to prevent public internet access to VPC resources. BPA in ingress-only mode blocks all traffic from the internet. This feature supersedes any other settings and blocks any inbound traffic from the internet. When you use ingress-only mode, outbound traffic from the VPC to the internet is allowed. This solution blocks inbound traffic from the internet with minimal operational overhead because you do not need to make any additional configurations. Why is Egress Only Internet Gateway not the correct option? An egress-only internet gateway is a VPC component that allows outbound communication from instances in a VPC to the internet. Egress-only internet gateways also prevent the internet from initiating a connection with instances in a VPC. An egress-only internet gateway would block inbound traffic from the internet. However, this solution would require you to make changes to VPC routing. Additionally, you would need to ensure that all VPC resources have an IPv6 address because an egress-only internet gateway does not support IPv4. Therefore, this solution would require additional operational overhead. And why not deleting the VPC default security group? The VPC default security group is created automatically when you create a VPC. When you do not specify a security group for a resource that is deployed into a VPC, the default security group is assigned. The default security group is overly permissive. Therefore, using the default security group is not recommended. Instead, you should define a specific security group for the resource. Removing the inbound 0.0.0.0/0 rule from the default security group would only affect resources that are associated with the group. This solution would not block all traffic from the internet."
  },
  {
    id: 40,
    domain: 'Question 40',
    question: "A company wants to integrate an external continuous integration and continuous delivery (CI/CD) system with an AWS environment. The company wants to follow security best practices. The company uses its own identity provider (IdP) for authentication and authorization. The company wants a solution that provides short-lived credentials without managing an additional AWS service. The company wants to minimize changes to its existing identity management setup. Which configuration will meet these requirements?",
    options: [
      "Configure AWS IAM Identity Center. Configure synchronization between IAM Identity Center and the company's IdP by specifying the company's IdP as the identity source. Use the company's IdP to manage the identity of the CI/CD system.",
      "Configure an IAM user. Configure access and secret keys for the IAM user. Use the company's IdP to manage the identity of the CI/CD system. Use the company's IdP to manage access and secret keys for the CI/CD system.",
      "Configure an IAM OpenID Connect (OIDC) IdP. Create a new IAM web identity role and associate it with the newly created IAM OIDC IdP. Use the company's IdP to manage the identity of the CI/CD system.",
      "Configure an IAM user. Configure access and secret keys for the IAM user. Use the IAM access and secret keys with AWS Security Token Service (AWS STS) to generate temporary AWS credentials. Use the temporary credentials in the CI/CD system to integrate with the AWS environment.",
    ],
    correct: 2,
    explanation: "You can use IAM OIDC IdPs when you want to connect an external OIDC-compatible IdP to AWS resources. IAM OIDC IdPs use OIDC federation to enable machine-to-machine authentication workflows. You can configure an IAM OIDC IdP so that the CI/CD system can obtain short-lived credentials without managing additional AWS services. This solution uses the company's existing IdP and minimizes changes to the company's identity management setup. By creating an IAM web identity role that is associated with the OIDC provider, you establish a secure, temporary credential mechanism. This solution follows AWS security best practices for machine-to-machine authentication. Why is A incorrect? Incorrect. You can use IAM Identity Center to provide user access from external IdPs to AWS applications by using the SAML protocol. You would typically use IAM Identity Center to provide single sign-on access for external users to AWS services. In the scenario, you need to configure a machine-to-machine authentication workflow. You do not need to configure single sign-on access for external users. Why are B and D incorrect? Using IAM users is not short lived and is not a best practice, role are better suited for this purpose."
  },
  {
    id: 41,
    domain: 'Question 41',
    question: "A company uses services in multiple AWS accounts in an organization in AWS Organizations. To meet compliance requirements, a CloudOps engineer must ensure that services are not deployed outside of the `us-east-1` and `eu-central-1` AWS Regions. Which solution will meet this requirement with the LEAST operational effort?",
    options: [
      "Create a service control policy (SCP) that denies all actions when the requested Region is not `us-east-1` or `eu-central-1`.",
      "Create a service control policy (SCP) that allows all actions when the requested Region is `us-east-1` or `eu-central-1`.",
      "In the management account, disable all Regions except `us-east-1` and `eu-central-1` for all member accounts.",
      "In each member account, disable all Regions except `us-east-1` and `eu-central-1`.",
    ],
    correct: 0,
    explanation: "SCPs are an organization policy that can limit which services, actions, or Regions are available in an AWS account. An SCP with an explicit deny for actions outside of the specified Regions provides the strongest enforcement with minimal operational effort. All accounts in the organization inherit SCPs. SCPs cannot be overridden. Therefore, this solution ensures consistent compliance."
  },
  {
    id: 42,
    domain: 'Question 42',
    question: "A company needs to centralize the management of Amazon EC2 instances across multiple AWS accounts and AWS Regions. The company requires daily patching of critical security updates, weekly system health checks, and automated remediation of common issues. The solution must provide detailed logs of all the actions that are taken. The solution must support approval workflows for sensitive operations. Which solution will meet these requirements with the LEAST operational overhead?",
    options: [
      "Create AWS Lambda functions that are invoked by Amazon EventBridge rules to run scripts on the EC2 instances. Store logs in Amazon CloudWatch Logs. Implement AWS Step Functions for approval workflows.",
      "Create AWS Systems Manager Automation runbooks that use predefined actions to perform patching, health checks, and remediation. Configure Systems Manager State Manager associations to run on a schedule and use approvals for sensitive operations.",
      "Configure AWS Systems Manager State Manager associations to run command documents to perform patching and health checks. Use Systems Manager Session Manager for manual remediation of issues and logging operations.",
      "Configure AWS Config rules to detect instances that require updates. Use AWS CloudFormation templates to deploy patches and remediation scripts when invoked by AWS Config rule violations. Store logs in Amazon S3. Use Amazon Simple Notification Service (Amazon SNS) for approvals.",
    ],
    correct: 1,
    explanation: "Systems Manager is a management service that provides a unified interface to manage AWS resources across accounts and Regions. Automation runbooks are designed specifically for automating common maintenance and deployment tasks across AWS resources. Runbooks can include predefined actions for patching, health checks, and automated remediation. State Manager can schedule the runbooks to run on a regular basis. All actions are automatically logged in Systems Manager. Therefore, this solution provides detailed audit trails. This solution uses built-in capabilities that require minimal operational overhead to implement and manage. So why was option C incorrect? State Manager can handle scheduled tasks such as patching and health checks. However, using Session Manager for manual remediation does not meet the requirement for automated remediation. Additionally, this solution does not provide built-in approval workflows for sensitive operations."
  },
  {
    id: 43,
    domain: 'Question 43',
    question: "A company in a highly regulated industry must encrypt all its Amazon Elastic Block Store (Amazon EBS) volumes. The company created an AWS Key Management Service (AWS KMS) key in a development account to encrypt the EBS volumes. The key is a customer managed key. The company has used the key several times to encrypt and decrypt volumes in the development account. Now, the company wants to use the same key to encrypt volumes in a quality assurance (QA) account. An IAM user in the QA account attempted to encrypt a volume in the development account by using the Amazon Resource Name (ARN) of the key. However, the IAM user receives an access denied error, and the volume cannot be encrypted. The IAM user in the QA account has attached a policy that was written correctly. Which action will allow the user in the QA account to encrypt volumes in the development account?",
    options: [
      "Add an IAM policy to the IAM user in the QA account. Configure the policy to explicitly allow the action kms:Encrypt to the specific ARN of the KMS key (resource) in the development account.",
      "Modify the resource policy of the KMS key in the development account to allow the IAM user in the QA account to use the key to encrypt resources.",
      "Create a second KMS customer managed key in the QA account. Add a policy to the IAM user in the QA account that can encrypt EBS volumes by using the KMS key.",
      "Configure an IAM user in the development account with encrypt permissions on the KMS key and permissions to create the required EBS volumes in the QA account.",
    ],
    correct: 1,
    explanation: "A key policy is a resource policy that controls access to a KMS key. Cross-account access to KMS keys requires explicit permissions in the key policy to allow the external account or specific principals to use the key. Why the others are wrong? IAM policies define permissions for IAM principals to perform actions on AWS resources. An IAM principal in an AWS account is not allowed to access KMS keys in other accounts even if the IAM principal has permissions to do so. Even with this policy, cross-account KMS key access requires both IAM permissions and key policy permissions in the development account. Customer managed keys are KMS keys that you create, own, and manage in your AWS account. The company wants to encrypt all the volumes in both accounts by using the same KMS key. If you create another key in the QA account, you are not encrypting the volumes with the same KMS key. This solution does not meet the requirement to use the existing key from the development account. IAM principals can create resources only in their own account unless the principals are specifically granted cross-account access. Granting permissions in the development account does not allow the IAM user in the QA account to use the KMS key."
  },
  {
    id: 44,
    domain: "Question 44",
    question: "A CloudOps engineer needs to configure a deployment strategy that updates a containerized application. The application runs on Amazon Elastic Container Service (Amazon ECS) behind an Application Load Balancer (ALB). The deployment strategy must provide little to no downtime. Which deployment configuration of an ECS service will meet this requirement MOST cost-effectively?",
    options: [
      "Configure a linear deployment with two target groups.",
      "Configure a rolling deployment with one target group.",
      "Configure a canary deployment with weighted routing.",
      "Configure an in-place deployment with one target group.",
    ],
    correct: 1,
    explanation: "A rolling deployment sequentially deploys revisions to instances. This deployment gradually replaces tasks with new versions. Rolling deployments maintain application availability by gradually updating tasks in small batches. This strategy automatically replaces the old version with the new version. This strategy uses health checks to verify new tasks before removing old tasks. This strategy does not require you to maintain any additional infrastructure. Therefore, this strategy is the most cost-effective deployment configuration for this scenario. A linear deployment will shift traffic in equal increments with an equal number of minutes between each increment. A linear deployment with two target groups would incur additional costs to maintain a second target group. A canary deployment shifts a small percentage of traffic for validation. A canary deployment with weighted routing requires additional infrastructure to split traffic. A weighted routing configuration leads to higher costs for this scenario. In-place deployments update tasks directly in a production environment. In-place deployments stop and start tasks on the same container instance. This strategy causes service interruptions during updates. Therefore, this strategy does not meet the requirement for minimal downtime."
  },
  {
    id: 45,
    domain: "Question 45",
    question: "A company hosts the domain example.com in Amazon Route 53. The company sends emails by using Amazon Simple Email Service (Amazon SES). Some recipients are not receiving the emails. A CloudOps engineer investigates the issue and identifies that some recipient servers are rejecting the emails. Which configuration in Route 53 will resolve the email delivery issue?",
    options: [
      "Add a mail exchange (MX) record that points to the IP addresses of the Amazon SES service.",
      "Add a text (TXT) record with `v=spf1 include:amazonses.com -all`.",
      "Add an alias (A) record that points to the IP addresses of the Amazon SES service.",
      "Enable DNS Security Extensions (DNSSEC) for example.com.",
    ],
    correct: 1,
    explanation: "You can add a TXT record with Sender Policy Framework (SPF) information. This solution helps receiving mail servers verify that the sending IP address is authorized to send email on behalf of the domain. The SPF record specifies which IP addresses are allowed to send email for the domain. To prevent spoofing and to improve email deliverability, you should add an SPF record as a TXT record. Why are MX records not the correct answer? You can use MX records to specify mail servers to receive emails. You would not use MX records to send emails. This configuration would not resolve the issue. Why no A/alias records? You can use an A record to map a domain to an IP address. An A record does not help with email authentication. And DNSSEC? DNSSEC provides the authentication of DNS responses. DNSSEC does not address email spam issues. DNSSEC does not validate that an IP address is authorized to send email for a domain."
  },
  {
    id: 46,
    domain: "Question 46",
    question: "A CloudOps engineer is troubleshooting an event-driven system that processes customer transactions. The system uses Amazon S3 Event Notifications to invoke AWS Lambda functions. The Lambda functions process transaction files and store the results in a downstream data storage service. The CloudOps engineer observes that transaction files that are uploaded to a specific folder in Amazon S3 are not being processed. Files that are uploaded to other folders are processing successfully. The Lambda function logs have no visible errors. Which step should the CloudOps engineer take to address this issue?",
    options: [
      "Verify that the Lambda function's execution role has the necessary permissions to access the S3 bucket. Modify the Lambda function code to implement retry logic with exponential backoff for failed operations.",
      "Increase the Lambda function's timeout and memory allocation. Monitor future invocations of the Lambda function.",
      "Replace S3 Event Notifications with an Amazon EventBridge rule that invokes the Lambda functions. Configure an EventBridge rule to retry failed events and send unprocessable events to a downstream notification service.",
      "Ensure that the S3 prefix for the S3 Event Notifications was set properly. Monitor future invocations of the Lambda function.",
    ],
    correct: 3,
    explanation: "S3 Event Notifications can use prefix filtering to determine which objects trigger notifications. For example, this solution can determine what are valid and invalid prefix and suffix formats. You have a prefix configuration issue if files in a specific folder are not being processed while other folders are processing files successfully. You can verify and correct the S3 prefix configuration to ensure that notifications generate for files in all intended folders. For example, you cannot use a wildcard character ("*") in object filters as a prefix or suffix. Why are the other answer incorrect? You can verify Lambda permissions and implement retry logic. However, this solution would not resolve the specific folder processing issue. A permissions issue would affect files in all folders, not only one specific folder. The scenario indicates that files in other folders are processing successfully. You can increase the Lambda timeout and memory allocation to help if the function times out or runs out of memory. The scenario indicates that files in other folders are processing successfully. Therefore, the Lambda configuration is not the issue. Also, if the function is triggered but times out or runs out of memory, you would see errors in the logs indicating function timeout or out-of-memory. Replacing S3 Event Notifications with an EventBridge rule is an over-kill and introduces more overhead; you should first verify the simpler configuration issue."
  },
  {
    id: 47,
    domain: "Question 47",
    question: "A company deploys a web application to Amazon EC2 instances behind Auto Scaling groups across multiple AWS Regions. The company configures Amazon CloudWatch alarms to be invoked when the average CPU utilization of the EC2 instances exceeds 70% for 5 minutes. A CloudOps engineer needs to implement a solution to automatically scale out the Auto Scaling groups in each Region when the CPU alarms are invoked. Which solution will meet these requirements with the LEAST operational overhead?",
    options: [
      "Create an AWS Lambda function that is invoked by the CloudWatch alarms. Write the Lambda function to call the Auto Scaling group's Auto Scaling APIs to dynamically scale out the groups in each Region.",
      "Configure scaling policies directly on the Auto Scaling groups to scale out when the CloudWatch alarms are invoked.",
      "Create AWS Step Functions state machines that are invoked by the CloudWatch alarms to scale out the Auto Scaling groups.",
      "Configure AWS Systems Manager Automation documents to run on a schedule and check CloudWatch for invoked alarms before scaling out the Auto Scaling groups..",
    ],
    correct: 1,
    explanation: "You can use scaling policies to scale the capacity of an Auto Scaling group based on CloudWatch alarms. You can use scaling policies to scale resources based on the CPUUtilization metric alarm. This solution requires minimal operational overhead because you can set the scaling policy within the Auto Scaling groups. You do not need to incorporate other services."
  },
  {
    id: 48,
    domain: "Question 48",
    question: "A company is designing an application that will be load balanced across multiple Availability Zones. The application consists of a web tier and an API tier. The web tier serves HTTP web requests. The API tier handles millions of requests. The web tier and API tier must be integrated with health checks. A CloudOps engineer must configure health checks for each tier to ensure high availability. Which solution will meet these requirements?",
    options: [
      "Configure Application Load Balancer (ALB) health checks for the web tier by using the HTTP path /index.html and status codes 200–399. Configure Network Load Balancer (NLB) health checks for the API tier by using TCP health checks on port 8080.",
      "Configure Application Load Balancer (ALB) health checks for both the web tier and the API tier. Configure the web tier by using TCP health checks on port 80. Configure the API tier by using TCP health checks on port 8080.",
      "Configure Network Load Balancer (NLB) health checks for both the web tier and the API tier. Configure the web tier by using HTTP path /index.html on port 8080. Configure the API tier by using TCP health checks on port 8080.",
      "Configure Application Load Balancer (ALB) health checks for the web tier by using TCP health checks on port 80. Configure Network Load Balancer (NLB) health checks for the API tier by using the HTTP path /api/health and status codes 200–399.",
    ],
    correct: 0,
    explanation: "An ALB is suitable for the web tier because ALBs support layer 7 routing and HTTP health checks on specific paths. An NLB is suitable for the API tier because an NLB performs load balancing at layer 4 and supports TCP health checks on a specific port. Additionally, an NLB can handle the millions of requests that the API tier requires."
  },
  {
    id: 49,
    domain: "Question 49",
    question: "A company created a serverless application based on microservices that run on AWS Lambda functions. The application works as expected. However, the response times are higher than expected. A CloudOps engineer investigates Amazon CloudWatch Lambda Insights. The cause of the issue is that one of the Lambda functions spends extra time running during the initialization of the code. Which solution will resolve this issue with the LEAST development effort?",
    options: [
      "Configure reserved concurrency on the Lambda function.",
      "Configure provisioned concurrency on the Lambda function.",
      "Modify the initialization code for the Lambda function.",
      "Create another Lambda function with the same initialization code and split the invocations.",
    ],
    correct: 1,
    explanation: "Provisioned concurrency specifies the number of pre-initialized execution environments that a Lambda function has. If the initialization of the code is pre-provisioned, then the Lambda function will spend less time running."
  },
  {
    id: 50,
    domain: "Question 50",
    question: "A financial company runs a regulated web application. The company uses AWS CloudFormation to deploy the application. The application runs on Amazon EC2 instances behind an Application Load Balancer (ALB). The instances run in an Amazon EC2 Auto Scaling group. For compliance, the company must send a complete copy of all regulated data on the attached Amazon Elastic Block Store (Amazon EBS) volumes to an Amazon S3 bucket before an EC2 instance is terminated. In testing, some EC2 instances are terminated before the data can be completely copied. What can a CloudOps engineer do to resolve this problem in normal operating conditions?",
    options: [
      "Configure EC2 Auto Scaling lifecycle hooks to put the instances into a Terminating:Wait status before the instances are terminated. When the copy is complete, use the complete-lifecycle-action command.",
      "Use S3 Lifecycle hooks to enable the CreateMultipartUpload API feature with S3 Transfer Acceleration. When the copy is complete, use the complete-lifecycle-action command.",
      "Update the CloudFormation stack template, and set the DisableApiTermination property to true for the EC2 instances. Run an update-stack operation.",
      "Update the CloudFormation stack template, and set the AutoEnableIO property to true for the EBS volumes. Run an update-stack operation.",
    ],
    correct: 0,
    explanation: "The implementation of functions on a terminating instance can take time that must be accounted for as part of the EC2 lifecycle. EC2 Auto Scaling allows for a lifecycle hook to be applied to an instance as it begins to be decommissioned. The lifecycle hook puts the instance into a wait state (Terminating:Wait). During the default timeout period, exit functions can be run on the instance. When these functions are complete, a change in the status to Terminating:Proceed allows the termination function to finish."
  },
  {
    id: 51,
    domain: "Question 51",
    question: "A global company has an existing Amazon S3 bucket in the us-east-1 AWS Region that contains critical business documents. For compliance reasons, the company needs to replicate all new and modified objects to a bucket in the eu-west-1 Region. A CloudOps engineer must ensure that all future changes are replicated. Which solution will meet these requirements?",
    options: [
      "Enable versioning on the destination bucket. Configure a replication rule for both the source bucket and the destination bucket. Create an IAM role with the required permissions for S3 replication.",
      "Enable versioning on the source bucket and the destination bucket. Configure a replication rule in the source account. Create an IAM role with the required permissions for S3 replication.",
      "Configure a replication rule for the source bucket. Enable versioning on the source bucket. Create an IAM role with the required permissions for S3 replication.",
      "Enable versioning on the source bucket. Configure a replication rule for the source bucket with an existing IAM role.",
    ],
    correct: 1,
    explanation: "The implementation of functions on a terminating instance can take time that must be accounted for as part of the EC2 lifecycle. EC2 Auto Scaling allows for a lifecycle hook to be applied to an instance as it begins to be decommissioned. The lifecycle hook puts the instance into a wait state (Terminating:Wait). During the default timeout period, exit functions can be run on the instance. When these functions are complete, a change in the status to Terminating:Proceed allows the termination function to finish."
  },
  {
    id: 52,
    domain: "Question 52",
    question: "A medical company hosts an application on AWS. The company needs to be alerted if any logs in Amazon CloudWatch Logs contain protected health information (PHI). Which solution will meet this requirement?",
    options: [
      "Enable CloudWatch Logs data protection policies. Create a CloudWatch alarm that invokes based on the LogEventsWithFindings metric.",
      "Configure Amazon Macie. Create a CloudWatch alarm that invokes based on any SensitiveData:* findings and sends a notification by using Amazon Simple Notification Service (Amazon SNS).",
      "Configure Amazon Macie. Use an AWS Lambda function to process Macie events and publish a custom metric to CloudWatch based on any SensitiveData:* findings. Create a CloudWatch alarm that invokes based on the custom metric.",
      "Enable Amazon GuardDuty. Use an AWS Lambda function to process GuardDuty findings. Create a CloudWatch alarm based on GuardDuty findings that relate to sensitive data events.",
    ],
    correct: 0,
    explanation: "CloudWatch Logs data protection policies help identify and protect sensitive data within CloudWatch Logs. Sensitive data includes personally identifiable information (PII) or PHI. CloudWatch Logs data protection policies automatically detect sensitive data patterns. CloudWatch Logs data protection policies can invoke alerts or initiate actions when sensitive data is logged."
  },
  {
    id: 53,
    domain: "Question 53",
    question: "A company has two VPCs in the same AWS Region. One VPC is a production VPC with CIDR block 10.0.0.0/16. The other VPC is a management VPC with CIDR block 172.16.0.0/16. A CloudOps engineer configured a VPC peering connection between the two VPCs and accepted the peering request. All subnets use the default network ACL. However, the Amazon EC2 instances in the production VPC cannot communicate with the instances in the management VPC. Amazon CloudWatch metrics indicate no recorded logs of communication. How can the CloudOps engineer resolve this issue?",
    options: [
      "Update the security groups in both VPCs to allow cross-VPC traffic.",
      "Update the route tables in both VPCs to route traffic through the peering connection.",
      "Update the network ACLs to allow traffic between both VPCs.",
      "Update the CIDR block on the management VPC to overlap with the production VPC.",
    ],
    correct: 1,
    explanation: "You must establish and accept a VPC peering connection. Then, you must update route tables in both VPCs to route traffic that is destined for the other VPC through the peering connection. Without these route table entries, the VPCs will not know how to route traffic to each other, even though the peering connection exists."
  },
  {
    id: 54,
    domain: "Question 54",
    question: "A company requires that all instances receive operating system (OS) patches within 7 days of release. The company uses AWS Systems Manager to manage Amazon EC2 instances. The EC2 instances run Windows Server OS across development, testing, and production environments. All instances have the Systems Manager Agent (SSM Agent) installed and proper IAM roles configured. A CloudOps engineer needs to implement an automated patching solution. The solution must ensure that production workloads are not disrupted during business hours. Which combination of steps should the CloudOps engineer take to implement this solution? (Select TWO.)",
    options: [
      "Create a patch baseline with an auto-approval delay of 7 days. Configure the patch baseline as the default for Windows Server.",
      "Configure AWS Config rules to check the patch compliance status and to automatically install missing patches.",
      "Create a maintenance window task that runs weekly during nonbusiness hours and uses the AWS-RunPatchBaseline document.",
      "Use Systems Manager State Manager to run the AWS-RunPatchBaseline document on a daily schedule.",
      "Create an Amazon EventBridge rule to trigger AWS-RunPatchBaseline as soon as new patches are available.",
    ],
    correct: [0,2],
    explanation: "Correct: Patch Manager patch baselines define which patches can be automatically approved and installed. Setting an auto-approval delay will meet the company's policy to patch within 7 days of release. You can use this approach to test in non-production environments before applying patches to production systems. Maintenance windows provide scheduled patching during specified time periods. This solution minimizes the impact on business operations. By scheduling the AWS-RunPatchBaseline document to run during nonbusiness hours, you can ensure that production workloads are not disrupted. Additionally, you can maintain regular patch compliance. Incorrect: AWS Config is a configuration assessment service that can monitor patch compliance. AWS Config cannot automatically install patches. You can use AWS Config to report on compliance status. However, actual patch deployment requires Patch Manager capabilities. State Manager is a configuration management service that you can use to automate the process to keep AWS resources in a defined state. You can use State Manager to run the AWS-RunPatchBaseline document. However, daily execution does not align with the business requirement to minimize disruption. Daily patching could cause unnecessary system interruptions. Daily patching does not address the business hours or maintenance window requirements. You can use EventBridge to decouple applications and build event-driven applications. You can use EventBridge to invoke immediate patching when updates become available. However, this approach would disrupt production workloads at unpredictable times. This approach does not address the business hours or maintenance window requirements. This approach would impact the production monitoring system."
  },
  {
    id: 55,
    domain: "Question 55",
    question: "A CloudOps engineer must automate the creation of custom Amazon Machine Images (AMIs). The CloudOps engineer notices timeout errors on the EC2 Image Builder pipeline. What is the cause of the timeout errors?",
    options: [
      "There are insufficient permissions granted to the Image Builder role that is configured in the pipeline.",
      "The base AMI that is specified in the configuration is no longer available.",
      "The AWS Systems Manager Agent (SSM Agent) on the build instance is not running or reachable.",
      "The Image Builder pipeline was tagged with the key value executable set to false.",
    ],
    correct: 2,
    explanation: "Image Builder uses the SSM Agent to manage the build instance and to run build components. Additionally, the SSM Agent can collect logs. If the SSM Agent is not running, is unresponsive because of network issues, or is misconfigured, then the pipeline will hang during a build step. This issue will eventually lead to a timeout error as Image Builder waits for a response."
    },
    {
      id: 56,
      domain: 'Question 56',
      question: 'A company uses AWS Organizations to manage multiple AWS accounts. All Amazon RDS snapshots must be encrypted with an AWS Key Management Service (AWS KMS) key. A CloudOps engineer must implement a service control policy (SCP). The SCP must prevent the deletion of AWS KMS keys without impacting other administrative operations on the KMS keys. Which SCP will meet these requirements?',
      options: [
        `
           {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Deny",
                        "Action": [
                            "kms:ScheduleKeyDeletion",
                            "kms:Delete*"
                        ],
                        "Resource": "*"
                    }
                ]
            }
        `,
        `
           {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Deny",
                        "NotAction": [
                            "kms:ScheduleKeyDeletion",
                            "kms:Delete*"
                        ],
                        "Resource": "*"
                    }
                ]
            }
        `,
        `
          {
              "Version": "2012-10-17",
              "Statement": [
                  {
                      "Effect": "Allow",
                      "NotAction": [
                          "kms:ScheduleKeyDeletion",
                          "kms:Delete*"
                      ],
                      "Resource": "*"
                  }
              ]
          }
        `,
       `
          {
              "Version": "2012-10-17",
              "Statement": [
                  {
                      "Effect": "Deny",
                      "Action": [
                          "kms:ScheduleKeyDeletion",
                          "kms:*"
                      ],
                      "Resource": "*"
                  }
              ]
          }
        `,
      ],
      correct: 0,
      explanation: 'SCPs limit permissions in an organization. This SCP uses "Effect": "Deny" to explicitly prevent the specified actions. The SCP also targets the specific AWS KMS actions that relate to key deletion: "kms:ScheduleKeyDeletion" and "kms:Delete*". The wildcard in "kms:Delete*" covers all delete-related actions. The SCP also applies to all resources ("Resource": "*"). Therefore, this solution ensures comprehensive protection. This solution meets the requirement to prevent the deletion of KMS keys.',
    },
    {
      id: 57,
      domain: "Question 57",
      question: "A CloudOps engineer manages a fleet of Amazon EC2 Linux instances in a single AWS account. All instances have AWS Systems Manager Agent (SSM Agent) installed and proper IAM roles configured. The CloudOps engineer needs to quickly deploy a security fix by running a command. The security fix must install a package across all instances. The CloudOps engineer needs to execute the command and track the execution status for each instance. Which solution will meet these requirements?",
      options: [
        "Connect to each instance by using Systems Manager Session Manager. Manually run the command. Monitor the command output in each session.",
        "Use Systems Manager Run Command to run the command. Track the execution status and output for each instance in the Systems Manager console.",
        "Create a Systems Manager State Manager association with the command. Deploy the association to the account. Specify the instances as targets.",
        "Use Systems Manager Fleet Manager to establish individual terminal sessions to each instance. Run the command. Monitor the command output in each terminal session.",
      ],
      correct: 1,
      explanation: "Run Command is designed to run the simultaneous execution of commands across multiple instances. Run Command provides real-time status tracking. Run Command maintains an audit trail of command execution. Additionally, Run Command provides command output for each instance through the Systems Manager console. Why not fleet manager? The Fleet Manager terminal feature requires you to establish individual connections to each instance. This solution is manual and time-consuming. This solution does not provide centralized execution status tracking. This solution would not meet the requirement to quickly deploy the security package across multiple instances. nd Stte mnger? State Manager is designed to maintain a consistent state over time. For example, State Manager can regularly apply specific software installations or configurations. You can run commands by using State Manager. However, this approach is not an appropriate tool for one-time command execution across multiple instances. Using State Manager requires more time to create a Systems Manager document and deploy the association."
    },
    {
      id: 58,
      domain: "Question 58",
      question: "A company uses AWS Organizations to manage access across multiple AWS accounts. A CloudOps engineer must configure a solution to allow developers in a development (dev) account to launch Amazon EC2 instances in a staging account. Which solution will meet this requirement?",
      options: [
        "Create an IAM policy in the dev account that allows EC2 instance launches. Attach the IAM policy to the developers' IAM user identities.",
        "Create an IAM role in the dev account. Grant the staging account permission to assume the role.",
        "Create an IAM role in the staging account. Grant the dev account permission to assume the role. Share the role Amazon Resource Name (ARN) with developers in the dev account.",
        "Create a service control policy (SCP) in Organizations that allows EC2 instance launches in the staging account. Apply the SCP to the organizational unit (OU) that contains the dev account.",
      ],
      correct: 2,
      explanation: "An IAM role is an IAM identity that has specific permissions. You must create the IAM role in the target account to allow cross-account access. You must grant permissions to the source account to assume the role. Then, source account users can use the role ARN to take on permissions temporarily when accessing resources. Developers in the dev account can assume the role temporarily to perform the required actions in the staging account. This solution meets the requirements and follows the principle of least privilege. Incorrect. You can use SCPs to manage permissions across an organization. SCPs are designed to restrict permissions, not to grant permissions. An SCP cannot provide permissions to developers in one account to launch instances in another account."
    },
    {
      id: 59,
      domain: "Question 59",
      question: "A company operates in a multi-account AWS environment by using AWS Organizations. A CloudOps engineer discovers that developers across different member accounts are launching Amazon EC2 instances that are larger than necessary. The CloudOps engineer needs a solution to set limits and control EC2 instance types across all accounts. Which solution will meet these requirements with the LEAST operational overhead?",
      options: [
        "Create an AWS Service Catalog portfolio in the management account. Share the portfolio with member accounts. Use IAM policies to require developers to launch instances only through Service Catalog products.",
        "Deploy AWS Config rules by using AWS CloudFormation StackSets across all accounts to detect noncompliant instance types.",
        "Create IAM permissions boundaries in each member account that restrict the EC2 instance types that developers can launch.",
        "Create a service control policy (SCP) that restricts EC2 instance types to approved sizes across all member accounts.",
      ],
      correct: 3,
      explanation: "SCPs are policies that you attach to organizations to manage permissions across accounts. SCPs provide a centralized way to enforce instance type restrictions across all accounts. This solution requires minimal maintenance and provides consistent control."
    },
    {
      id: 60,
      domain: "Question 60",
      question: "A company has an increasing number of workloads that run on AWS. The workloads include on-premises infrastructure. The number of VPCs continues to increase within a single AWS Region. Each time a new VPC is created, the new VPC needs to be peered with several other VPCs. Additionally, the new VPC needs to be attached to the on-premises AWS VPN. Which solution will meet these requirements in the MOST operationally efficient way?",
      options: [
        "Replace the peering connection with an AWS Transit Gateway. Attach the VPCs and VPN connections to the Transit Gateway.",
        "Supplement the peering connection by using AWS PrivateLink endpoints in all Amazon VPCs.",
        "Replace the peering connection with an AWS Site-to-Site VPN connection that uses virtual private gateways to connect all the VPNs.",
        "Supplement the peering connection with an AWS Direct Connect connection with a virtual interface for each VPC.",
      ],
      correct: 0,
      explanation: "You can use Transit Gateway to interconnect VPCs and on-premises networks. Transit Gateway acts as a central hub to route traffic between VPCs, on-premises environments, and other AWS services. Transit Gateway eliminates the need for complex peering connections. You can attach VPCs and VPN connections to a Transit Gateway. Then, you can centralize the network architecture and reduce operational overhead to manage and scale as the workload grows."
    },
    {
      id: 61,
      domain: "Question 61",
      question: "A CloudOps engineer discovers drift in an AWS CloudFormation stack. The CloudOps engineer discovers that critical security group inbound rules were manually added to meet urgent security requirements. The CloudOps engineer needs to update the stack with the new inbound rules while preserving the security configuration. Which solution will meet these requirements?",
      options: [
        "Import the current security group inbound rules configuration into the template by using CloudFormation drift detection results. Perform the stack update.",
        "Update the CloudFormation template to include the manually added security group inbound rules. Perform the stack update.",
        "Create a custom CloudFormation resource that detects and automatically incorporates any manually created security group inbound rules during stack updates.",
        "Create a change set to preview the impact of the stack update on the modified security group inbound rules. Perform the stack update.",
      ],
      correct: 1,
      explanation: "You can update the CloudFormation template to include all the desired resource configurations. You can add the manually created security rules to the template before you perform the update. This solution preserves the critical security requirements and maintains the benefits of template-based resource management. Why not change set? You can use change sets to preview how proposed changes to a stack would impact your running resources. A change set does not meet the requirement to preserve manual changes. The change set will show that the manual security group rules will be removed. However, the change set does not provide a way to preserve the changes. The rules would still be lost during the stack update unless you add the rules to the template."
      }
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
