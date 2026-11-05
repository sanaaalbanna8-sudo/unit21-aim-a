(function () {
  var TERMS = [
    ["Test-NetConnection", "Test-NetConnection: a Windows command that checks whether a TCP port accepts a connection."],
    ["IPCONFIG", "ipconfig: a Windows command that displays the IP configuration of a host."],
    ["IP ADDR", "ip addr: a Linux command that displays addresses configured on a network interface."],
    ["IPAddress", "IP address: the numerical label assigned to a device so traffic can be routed to it."],
    ["Traceroute", "Traceroute: a diagnostic that lists each hop a packet takes toward a destination."],
    ["Tracert", "Tracert: the Windows traceroute command, used to list each hop toward a destination."],
    ["Nslookup", "Nslookup: a tool that queries the Domain Name System for the address of a name."],
    ["Wireshark", "Wireshark: a packet-capture tool used to inspect traffic on a network."],
    ["Active Directory", "Active Directory: Microsoft's directory service for user, computer, and policy management."],
    ["Cross-Site Scripting", "Cross-Site Scripting (XSS): injecting a script into a page that other users' browsers then run."],
    ["SQL Injection", "SQL Injection: sending database commands through input that an application fails to validate."],
    ["Zero-day", "Zero-day: a vulnerability that is exploited before the vendor has issued a fix."],
    ["Supply Chain Attacks", "Supply Chain Attack: compromising a target through a trusted supplier, update, or dependency."],
    ["Supply Chain", "Supply Chain Attack: compromising a target through a trusted supplier, update, or dependency."],
    ["Defense in Depth", "Defense in Depth: layered controls so that one failed control does not expose the whole environment."],
    ["Chain of Custody", "Chain of Custody: the documented record of who collected, transferred, and stored each piece of evidence."],
    ["False Positives", "False Positives: alerts that resemble incidents but are not real threats."],
    ["System Images", "System Image: a bit-for-bit copy of a disk or system, preserved as forensic evidence."],
    ["Event Logs", "Event Logs: chronological records of what a system or application did."],
    ["Dumpster Diving", "Dumpster Diving: searching discarded paper or media for sensitive information."],
    ["Outdated Libraries", "Outdated Libraries: third-party software components left without security fixes."],
    ["Excessive Privileges", "Excessive Privileges: access rights broader than a person needs to do their job."],
    ["Insecure Services", "Insecure Services: network services exposed without adequate authentication or encryption."],
    ["Public S3 Buckets", "Public S3 Bucket: cloud object storage left readable or writable by anyone on the internet."],
    ["Trusted Computing", "Trusted Computing: hardware-backed mechanisms that help a platform prove it has not been tampered with."],
    ["Access Control Lists", "Access Control List: a rule set that states which identities may use a resource."],
    ["Audit Logs", "Audit Log: a record of security-relevant actions, kept so activity can be reviewed later."],
    ["Packet Sniffers", "Packet Sniffer: a tool that captures packets so an analyst can inspect network traffic."],
    ["Brute Force", "Brute Force: trying many passwords or keys until one is accepted."],
    ["Attack Surface", "Attack Surface: every point where an unauthorized person can try to enter a system or extract data."],
    ["MITRE ATT&CK", "MITRE ATT&CK: a public knowledge base of adversary tactics and techniques based on real incidents."],
    ["Cloud Security Alliance", "Cloud Security Alliance: an organization that publishes practical guidance for securing cloud computing."],
    ["PCI DSS", "PCI-DSS v4.0.1: a contractual industry security standard for organizations that store, process, or transmit card data. It is not a local statute and may sit alongside a data-protection law."],
    ["ISO 27031", "ISO/IEC 27031: guidance on information and communication technology readiness for business continuity."],
    ["ISO 27001", "ISO/IEC 27001:2022: the current international standard for an information security management system."],
    ["Verizon DBIR", "Verizon Data Breach Investigations Report: an annual study of real-world breaches and the patterns behind them."],
    ["DBIR", "Data Breach Investigations Report: Verizon's annual study of real-world breaches."],
    ["POP3S", "POP3S: the Post Office Protocol secured with TLS, commonly on port 995."],
    ["SFTP", "SFTP: file transfer over SSH, commonly on port 22. Prefer it to unencrypted FTP on port 21."],
    ["FTPS", "FTPS: File Transfer Protocol secured with TLS. For new transfers, prefer SFTP on port 22."],
    ["HTTPS", "Hypertext Transfer Protocol Secure: web traffic encrypted in transit, commonly on port 443."],
    ["HTTP", "Hypertext Transfer Protocol: the unencrypted protocol used to fetch ordinary web pages, commonly on port 80."],
    ["SMTP", "Simple Mail Transfer Protocol: the protocol used to send email."],
    ["POP3", "Post Office Protocol version 3: a protocol used to retrieve email from a server."],
    ["DHCP", "Dynamic Host Configuration Protocol: a service that assigns IP addresses to devices automatically."],
    ["Nmap", "Nmap (Network Mapper): a tool used to discover hosts and see which ports are open."],
    ["TCP/IP", "Transmission Control Protocol / Internet Protocol: the layered suite used to move data across networks."],
    ["ICMP", "Internet Control Message Protocol: a protocol used for network diagnostics such as ping."],
    ["ARP", "Address Resolution Protocol: maps an IP address to the hardware address of a local interface."],
    ["UDP", "User Datagram Protocol: a transport protocol that sends data quickly without guaranteeing delivery."],
    ["TCP", "Transmission Control Protocol: a transport protocol that checks delivery and keeps data in order."],
    ["DNS", "Domain Name System: the directory that turns names such as a website into IP addresses."],
    ["FTP", "File Transfer Protocol: a protocol for moving files, historically unencrypted on port 21."],
    ["SSL/TLS", "Secure Sockets Layer / Transport Layer Security: protocols that encrypt data while it travels between systems. TLS is the current protocol."],
    ["TLS", "Transport Layer Security: the protocol that encrypts data while it moves between two systems."],
    ["SSL", "Secure Sockets Layer: the earlier transport-encryption protocol, still used as a common name for that function. TLS replaced it."],
    ["XSS", "Cross-Site Scripting (XSS): injecting a script into a page that other users' browsers then run."],
    ["MFA", "Multi-Factor Authentication: proving identity with two or more independent factors, such as a password and a one-time code."],
    ["2FA", "Two-Factor Authentication: proving identity with exactly two independent factors."],
    ["OTP", "One-Time Password: a short-lived code used as an additional proof of identity."],
    ["DMZ", "Demilitarized Zone: a network segment that hosts public-facing services and is separated from the internal network."],
    ["VLAN", "Virtual Local Area Network: a logical separation that keeps groups of devices apart even on the same physical switches."],
    ["VLANs", "Virtual Local Area Networks: logical separations that keep groups of devices apart on shared switching equipment."],
    ["GDPR", "General Data Protection Regulation: the European Union law governing the protection of personal data."],
    ["CSIRT", "Computer Security Incident Response Team: the named group that coordinates the response to a security incident."],
    ["RTO", "Recovery Time Objective: the maximum time a system is allowed to stay unavailable after a disruption."],
    ["RPO", "Recovery Point Objective: the maximum amount of data loss, measured in time, that the organization will accept."],
    ["DRP", "Disaster Recovery Plan: the documented procedure for restoring critical systems after a major disruption."],
    ["SLA", "Service Level Agreement: the contractual statement of the service levels a provider must meet."],
    ["SLAs", "Service Level Agreements: contractual statements of the service levels a provider must meet."],
    ["ESP", "External Service Provider: an outside organization contracted to deliver a service."],
    ["OWASP", "Open Worldwide Application Security Project: a community that publishes practical guidance on application security, including the OWASP Top 10."],
    ["CVE", "Common Vulnerabilities and Exposures: a public identifier assigned to a known vulnerability."],
    ["NVD", "National Vulnerability Database: the U.S. government repository of described vulnerabilities and their severity."],
    ["CISA", "Cybersecurity and Infrastructure Security Agency: the United States agency responsible for infrastructure and cybersecurity guidance."],
    ["NCSC", "National Cyber Security Centre: the United Kingdom's national technical authority for cybersecurity."],
    ["ENISA", "European Union Agency for Cybersecurity: the EU agency that supports member states on cybersecurity policy and operations."],
    ["ISACA", "Information Systems Audit and Control Association: a professional body for governance, audit, and security of information systems."],
    ["SANS", "SANS Institute: a training and research body whose Reading Room publishes practitioner papers on cybersecurity."],
    ["Mandiant", "Mandiant Threat Intelligence: reporting on intrusion trends, threat groups, and incident findings."],
    ["CCTV", "Closed-Circuit Television: a video system used to monitor physical premises."],
    ["POS", "Point of Sale: the terminal that captures a payment at the moment of sale."],
    ["PDCA", "Plan-Do-Check-Act: the four-step continuous-improvement cycle used by management systems such as ISO/IEC 27001."],
    ["DDoS", "Distributed Denial of Service: a flood of traffic from many sources, intended to exhaust a service so legitimate users cannot reach it."],
    ["Ransomware", "Ransomware: malicious software that encrypts data and demands payment for the key."],
    ["Phishing", "Phishing: a social-engineering message crafted to trick a person into revealing credentials or executing a harmful action."],
    ["Hacking", "Hacking: deliberate unauthorized access to, or interference with, a computer system."],
    ["API", "Application Programming Interface: a defined method by which one piece of software requests data or actions from another."],
    ["APIs", "Application Programming Interfaces: defined methods by which software systems request data or actions from one another."],
    ["Firewall", "Firewall: a control, implemented in hardware or software, that allows or blocks network traffic according to rules."],
    ["Firewalls", "Firewalls: controls that allow or block network traffic according to security rules."],
    ["Heuristics", "Heuristics: detection that flags suspicious behavior even when the file does not match a known signature."],
    ["Signatures", "Signatures: known byte patterns used to recognize malicious software."],
    ["Ethernet", "Ethernet: the common family of wired local-area networking technologies."],
    ["Wi-Fi", "Wi-Fi: wireless local-area networking defined by the IEEE 802.11 family of standards."],
    ["WLAN", "Wireless Local Area Network: a local network that connects devices by radio rather than cable."],
    ["LAN", "Local Area Network: a network that connects devices within a limited site, such as one building."],
    ["USB", "Universal Serial Bus: a physical interface used to connect peripherals and removable storage."],
    ["Ping", "Ping: a diagnostic that sends a test message to a host and measures whether, and how quickly, it replies."],
    ["IoT", "Internet of Things: devices other than ordinary computers that connect to a network, such as sensors, cameras, and access points."],
    ["IP", "Internet Protocol: the addressing system that routes packets between networks."],
    ["Telnet", "Telnet: a remote-terminal protocol, also used in a limited way to test whether a TCP port accepts a connection."],
    ["Cloud", "Cloud computing: processing, storage, or software delivered over a network by a provider rather than kept only on local machines."],
    ["Patches", "Patches: software updates issued to correct defects, including security vulnerabilities."],
    ["Patch", "Patch: a software update issued to correct a defect or vulnerability."],
    ["Latency", "Latency: the delay between sending a request and receiving a response."],
    ["Inbound", "Inbound: traffic entering a network or host."],
    ["Outbound", "Outbound: traffic leaving a network or host."],
    ["Tailgating", "Tailgating: following an authorized person through a controlled door without presenting one's own credential."],
    ["Usability", "Usability: how readily people can complete their real work with a system."],
    ["Mitigation", "Mitigation: action that reduces the likelihood of a risk or the harm it would cause."],
    ["Transfer", "Transfer: moving a risk to another party, usually by contract or insurance."],
    ["Backup", "Backup: a retained copy of data that can be restored after loss or corruption."],
    ["On-site", "On-site: kept at the organization's own premises."],
    ["Off-site", "Off-site: kept at a separate physical location from the primary systems."],
    ["Mac", "MAC address (Media Access Control): the hardware address of a network interface."],
    ["MAC", "MAC address (Media Access Control): the hardware address of a network interface."],
    ["PPP", "Point-to-Point Protocol: a protocol for carrying network traffic over a direct link."],
    ["Explain", "Explain: give a clear, structured account of how or why something works, with reasons rather than a list of names."],
    ["Assess", "Assess: weigh importance, likelihood, or value, and state a justified judgement."],
    ["Evaluate", "Evaluate: judge how effective something is, using criteria and evidence, and reach a conclusion."],
    ["Analyse", "Analyse: break a situation into parts, show how those parts relate, and draw a reasoned conclusion."],
    ["Distinction", "Distinction: the highest grade band in this BTEC assessment, awarded for analytical, justified work."],
    ["Harvard", "Harvard style: an author-date referencing method in which sources are cited in the text and listed in full at the end."],
    ["Forensic Preservation", "Forensic preservation: protecting original evidence and working from controlled copies so the evidence remains admissible."],
    ["System Recovery", "System Recovery: restoring systems to a known trusted state after an incident."],
    ["Session Timeouts", "Session timeout: an automatic end to a signed-in session after a defined period of inactivity."],
    ["CBA", "Cost-Benefit Analysis: a comparison of what a control will cost against the loss it is intended to avoid."],
    ["Top 10", "OWASP Top 10: a regularly updated list of the most critical web-application security risks."],
    ["Krebs on Security", "Krebs on Security: an investigative site that reports on data breaches, fraud, and cybercrime."],
    ["The Hacker News", "The Hacker News: a news site that reports cybersecurity incidents, vulnerabilities, and research."]
  ].map(function (pair) {
    return {
      key: pair[0],
      re: new RegExp("\\b" + pair[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g"),
      tip: pair[1],
      len: pair[0].length
    };
  }).sort(function (a, b) { return b.len - a.len; });

  var AR = {
    "Test-NetConnection": "المعنى: اختبار اتصال الشبكة. التعريف: أمر في ويندوز يتحقق من أن منفذ TCP يقبل الاتصال.",
    "IPCONFIG": "المعنى: إعدادات العنوان. التعريف: أمر في ويندوز يعرض عنوان الجهاز وقناعه وبوابته.",
    "IP ADDR": "المعنى: عنوان الواجهة. التعريف: أمر في لينكس يعرض العناوين المعرّفة على واجهة الشبكة.",
    "IPAddress": "المعنى: عنوان IP. التعريف: الرقم الذي يُعرّف الجهاز حتى تصل إليه البيانات.",
    "Traceroute": "المعنى: تتبّع المسار. التعريف: أداة تعرض كل محطة تمر بها الحزمة حتى الوجهة.",
    "Tracert": "المعنى: تتبّع المسار. التعريف: أمر ويندوز لعرض المحطات بين الجهاز والوجهة.",
    "Nslookup": "المعنى: استعلام الأسماء. التعريف: أداة تسأل نظام أسماء النطاقات عن عنوان اسم معيّن.",
    "Wireshark": "المعنى: محلّل الحزم. التعريف: أداة تلتقط حركة الشبكة حتى يفحصها المحلّل.",
    "Active Directory": "المعنى: الدليل النشط. التعريف: خدمة مايكروسوفت لإدارة المستخدمين والأجهزة والسياسات.",
    "Cross-Site Scripting": "المعنى: حقن نص برمجي في الصفحة. التعريف: إدخال نص يُنفَّذ في متصفح مستخدم آخر. الرمز XSS.",
    "SQL Injection": "المعنى: حقن أوامر قاعدة البيانات. التعريف: إرسال أوامر عبر مدخل لم يتحقق منه التطبيق.",
    "Zero-day": "المعنى: اليوم الصفر. التعريف: ثغرة تُستغل قبل أن يصدر لها إصلاح.",
    "Supply Chain Attacks": "المعنى: هجمات سلسلة التوريد. التعريف: الوصول إلى الهدف عبر مورّد أو تحديث أو مكوّن موثوق.",
    "Supply Chain": "المعنى: سلسلة التوريد. التعريف: الوصول إلى الهدف عبر مورّد أو تحديث أو مكوّن موثوق.",
    "Defense in Depth": "المعنى: الدفاع متعدد الطبقات. التعريف: ضوابط متداخلة حتى لا يكفي سقوط ضابط واحد لكشف البيئة كلها.",
    "Chain of Custody": "المعنى: سلسلة الاحتفاظ بالأدلة. التعريف: سجل من جمع الدليل ونقله وحفظه حتى يبقى مقبولاً.",
    "False Positives": "المعنى: نتائج إيجابية كاذبة. التعريف: تنبيهات تشبه الحوادث لكنها ليست تهديدات حقيقية.",
    "System Images": "المعنى: صور النظام. التعريف: نسخة مطابقة للقرص أو النظام تُحفظ كدليل جنائي.",
    "Event Logs": "المعنى: سجلات الأحداث. التعريف: سجل زمني لما فعله النظام أو التطبيق.",
    "Dumpster Diving": "المعنى: البحث في المهملات. التعريف: استخراج معلومات حساسة من أوراق أو وسائط مرمية.",
    "Outdated Libraries": "المعنى: مكتبات قديمة. التعريف: مكوّنات برمجية من طرف ثالث بقيت بلا إصلاحات أمنية.",
    "Excessive Privileges": "المعنى: صلاحيات واسعة. التعريف: حقوق وصول أكبر مما يحتاجه الشخص لعمله.",
    "Insecure Services": "المعنى: خدمات غير آمنة. التعريف: خدمات شبكية مكشوفة بلا مصادقة أو تشفير كافيين.",
    "Public S3 Buckets": "المعنى: تخزين سحابي مكشوف. التعريف: مساحة تخزين يمكن لأي شخص على الإنترنت قراءتها أو الكتابة فيها.",
    "Trusted Computing": "المعنى: الحوسبة الموثوقة. التعريف: آليات مدعومة بالعتاد تساعد على إثبات أن الجهاز لم يُعبث به.",
    "Access Control Lists": "المعنى: قوائم التحكم في الوصول. التعريف: قواعد تحدد من يحق له استخدام مورد.",
    "Audit Logs": "المعنى: سجلات التدقيق. التعريف: سجل للإجراءات الأمنية يُراجع لاحقاً.",
    "Packet Sniffers": "المعنى: ملتقطو الحزم. التعريف: أدوات تلتقط الحزم لفحص حركة الشبكة.",
    "Brute Force": "المعنى: التخمين الشامل. التعريف: تجربة عدد كبير من كلمات المرور أو المفاتيح حتى يُقبل أحدها.",
    "Attack Surface": "المعنى: سطح الهجوم. التعريف: كل نقطة يمكن لمهاجم أن يحاول منها الدخول أو استخراج البيانات.",
    "MITRE ATT&CK": "المعنى: إطار تقنيات الخصوم. التعريف: قاعدة علنية لتكتيكات المهاجمين وتقنياتهم مبنية على حوادث حقيقية.",
    "Cloud Security Alliance": "المعنى: تحالف أمن السحابة. التعريف: جهة تنشر إرشادات عملية لتأمين الحوسبة السحابية.",
    "PCI DSS": "المعنى: معيار أمن بيانات بطاقات الدفع، الإصدار v4.0.1. التعريف: معيار تعاقدي صناعي، لا تشريع محلي. يجوز أن يرافق قانون حماية البيانات.",
    "ISO 27031": "المعنى: معيار جاهزية التقنية لاستمرار الأعمال. التعريف: إرشاد لاستعداد الاتصالات وتقنية المعلومات لاستمرار العمل.",
    "ISO 27001": "المعنى: معيار نظام إدارة أمن المعلومات. التعريف: الإصدار المعتمد هنا ISO 27001:2022.",
    "Verizon DBIR": "المعنى: تقرير تحقيقات اختراق البيانات. التعريف: دراسة سنوية لحوادث الاختراق الحقيقية وأنماطها.",
    "DBIR": "المعنى: تقرير تحقيقات الاختراق. التعريف: الدراسة السنوية التي تنشرها Verizon عن الاختراقات الواقعية.",
    "POP3S": "المعنى: جلب البريد عبر قناة مشفّرة. التعريف: بروتوكول جلب البريد مؤمَّناً بـ TLS، غالباً على المنفذ 995.",
    "SFTP": "المعنى: نقل الملفات عبر SSH. التعريف: القناة المفضّلة لنقل الملفات، على المنفذ 22، بدل FTP على المنفذ 21.",
    "FTPS": "المعنى: نقل الملفات عبر TLS. التعريف: نقل مشفّر. للنقل الجديد يُفضَّل SFTP على المنفذ 22.",
    "HTTPS": "المعنى: الويب المشفّر. التعريف: جلب صفحات الويب عبر اتصال مشفّر، غالباً على المنفذ 443.",
    "HTTP": "المعنى: بروتوكول الويب. التعريف: جلب الصفحات من غير تشفير، غالباً على المنفذ 80.",
    "SMTP": "المعنى: بروتوكول إرسال البريد. التعريف: البروتوكول المستخدم لإرسال البريد الإلكتروني.",
    "POP3": "المعنى: بروتوكول جلب البريد. التعريف: بروتوكول يجلب الرسائل من الخادم.",
    "DHCP": "المعنى: توزيع العناوين تلقائياً. التعريف: خدمة تعطي الأجهزة عناوين IP من غير إعداد يدوي.",
    "Nmap": "المعنى: ماسح الشبكة. التعريف: أداة تكتشف الأجهزة وترى المنافذ المفتوحة.",
    "TCP/IP": "المعنى: حزمة بروتوكولات الإنترنت. التعريف: الطبقات التي تُنقل بها البيانات عبر الشبكات.",
    "ICMP": "المعنى: رسائل التحكم بالشبكة. التعريف: بروتوكول للتشخيص، ومنه أمر ping.",
    "ARP": "المعنى: ربط العنوان بالعتاد. التعريف: يربط عنوان IP بعنوان العتاد للواجهة على الشبكة المحلية.",
    "UDP": "المعنى: بروتوكول النقل السريع. التعريف: يرسل البيانات بسرعة من غير ضمان وصولها أو ترتيبها.",
    "TCP": "المعنى: بروتوكول النقل الموثوق. التعريف: يتحقق من الوصول ويبقي البيانات مرتبة.",
    "DNS": "المعنى: نظام أسماء النطاقات. التعريف: يحوّل اسم الموقع إلى عنوان IP.",
    "FTP": "المعنى: بروتوكول نقل الملفات. التعريف: ينقل الملفات، وكان تاريخياً بلا تشفير على المنفذ 21.",
    "SSL/TLS": "المعنى: تشفير النقل. التعريف: بروتوكولات تشفّر البيانات أثناء انتقالها. TLS هو البروتوكول الحالي.",
    "TLS": "المعنى: أمن طبقة النقل. التعريف: البروتوكول الذي يشفّر البيانات بين نظامين.",
    "SSL": "المعنى: طبقة المقابس الآمنة. التعريف: بروتوكول تشفير أقدم. حلّ محلّه TLS، والاسم ما زال شائعاً.",
    "XSS": "المعنى: حقن نص في الصفحة. التعريف: إدخال نص يُنفَّذ في متصفح مستخدم آخر.",
    "MFA": "المعنى: المصادقة المتعددة. التعريف: إثبات الهوية بعاملين أو أكثر، مثل كلمة المرور ورمز لمرة واحدة.",
    "2FA": "المعنى: المصادقة الثنائية. التعريف: إثبات الهوية بعاملين مستقلين بالضبط.",
    "OTP": "المعنى: كلمة مرور لمرة واحدة. التعريف: رمز قصير العمر يُستخدم إثباتاً إضافياً للهوية.",
    "DMZ": "المعنى: المنطقة المحايدة. التعريف: جزء يستضيف الخدمات الظاهرة للعموم ويُفصل عن الشبكة الداخلية.",
    "VLAN": "المعنى: شبكة محلية افتراضية. التعريف: فصل منطقي يُبقي مجموعات الأجهزة منفصلة حتى على المبدّل نفسه.",
    "VLANs": "المعنى: شبكات محلية افتراضية. التعريف: فصول منطقية تُبقي مجموعات الأجهزة منفصلة على العتاد نفسه.",
    "GDPR": "المعنى: اللائحة الأوروبية لحماية البيانات. التعريف: قانون الاتحاد الأوروبي لحماية البيانات الشخصية.",
    "CSIRT": "المعنى: فريق الاستجابة للحوادث. التعريف: الفريق المسمّى الذي ينسّق الاستجابة لحادث أمني.",
    "RTO": "المعنى: هدف وقت الاسترداد. التعريف: أقصى زمن يُسمح فيه للنظام أن يبقى متوقفاً.",
    "RPO": "المعنى: هدف نقطة الاسترداد. التعريف: أقصى قدر من البيانات يُقبل فقده، ويُقاس بالزمن.",
    "DRP": "المعنى: خطة التعافي من الكوارث. التعريف: الإجراء المكتوب لاستعادة الأنظمة الحرجة بعد انقطاع كبير.",
    "SLA": "المعنى: اتفاقية مستوى الخدمة. التعريف: النص التعاقدي لمستوى الخدمة الذي يجب أن يحققه المزوّد.",
    "SLAs": "المعنى: اتفاقيات مستوى الخدمة. التعريف: النصوص التعاقدية لمستوى الخدمة المطلوب من المزوّد.",
    "ESP": "المعنى: مزود الخدمة الخارجي. التعريف: جهة من خارج المؤسسة تُتعاقد معها لتقديم خدمة.",
    "OWASP": "المعنى: مشروع أمن التطبيقات. التعريف: مجتمع ينشر إرشادات عملية لأمن التطبيقات، ومنها قائمة أعلى عشرة مخاطر.",
    "CVE": "المعنى: Common Vulnerabilities and Exposures، الثغرات والانكشافات الشائعة. التعريف: رقم عام يُعطى لثغرة واحدة معروفة.",
    "NVD": "المعنى: National Vulnerability Database، قاعدة البيانات الوطنية للثغرات. التعريف: قائمة أمريكية تجمع أرقام CVE وتصف الثغرة وشدتها.",
    "CISA": "المعنى: وكالة الأمن السيبراني والبنية التحتية. التعريف: الجهة الأمريكية المسؤولة عن إرشادات الأمن السيبراني والبنى التحتية.",
    "NCSC": "المعنى: المركز الوطني للأمن السيبراني. التعريف: السلطة التقنية البريطانية في الأمن السيبراني.",
    "ENISA": "المعنى: وكالة الاتحاد الأوروبي للأمن السيبراني. التعريف: الوكالة التي تدعم الدول الأعضاء في السياسة والعمليات.",
    "ISACA": "المعنى: جمعية تدقيق نظم المعلومات. التعريف: جهة مهنية لحوكمة نظم المعلومات وتدقيقها وأمنها.",
    "SANS": "المعنى: معهد سانس. التعريف: جهة تدريب وبحث تنشر أوراقاً تطبيقية في الأمن السيبراني.",
    "Mandiant": "المعنى: تقارير مانديانت. التعريف: تقارير عن اتجاهات الاختراق ومجموعات التهديد ونتائج الحوادث.",
    "CCTV": "المعنى: كاميرات المراقبة. التعريف: نظام فيديو لمراقبة المبنى.",
    "POS": "المعنى: نقطة البيع. التعريف: الجهاز الذي يلتقط الدفع لحظة البيع.",
    "PDCA": "المعنى: خطّط، نفّذ، تحقق، تصرّف. التعريف: دورة التحسين المستمر المستخدمة في أنظمة الإدارة مثل ISO 27001:2022.",
    "DDoS": "المعنى: الحرمان الموزّع من الخدمة. التعريف: سيل من مصادر كثيرة يُنهك الخدمة حتى لا يصل إليها المستخدم الشرعي.",
    "Ransomware": "المعنى: برمجيات الفدية. التعريف: برنامج خبيث يشفّر البيانات ويطلب مبلغاً مقابل المفتاح.",
    "Phishing": "المعنى: التصيد. التعريف: رسالة مصممة لخداع الشخص حتى يكشف بيانات أو ينفّذ إجراءً ضاراً.",
    "Hacking": "المعنى: الاختراق. التعريف: الوصول المتعمد غير المصرح به إلى نظام أو التدخل فيه.",
    "API": "المعنى: واجهة برمجية. التعريف: طريقة محددة يطلب بها برنامج بيانات أو إجراءً من برنامج آخر.",
    "APIs": "المعنى: واجهات برمجية. التعريف: طرق محددة تطلب بها الأنظمة البيانات أو الإجراءات من بعضها.",
    "Firewall": "المعنى: جدار الحماية. التعريف: ضابط يسمح بحركة الشبكة أو يمنعها وفق قواعد.",
    "Firewalls": "المعنى: جدران الحماية. التعريف: ضوابط تسمح بحركة الشبكة أو تمنعها وفق قواعد أمنية.",
    "Heuristics": "المعنى: الكشف السلوكي. التعريف: رصد السلوك المريب حتى لو لم يطابق الملف توقيعاً معروفاً.",
    "Signatures": "المعنى: التواقيع. التعريف: أنماط معروفة تُستخدم للتعرف على البرمجيات الخبيثة.",
    "Ethernet": "المعنى: الإيثرنت. التعريف: عائلة تقنيات الشبكة المحلية السلكية الشائعة.",
    "Wi-Fi": "المعنى: الواي فاي. التعريف: الشبكة المحلية اللاسلكية وفق معايير IEEE 802.11.",
    "WLAN": "المعنى: شبكة محلية لاسلكية. التعريف: شبكة تربط الأجهزة بالراديو لا بالكابل.",
    "LAN": "المعنى: شبكة محلية. التعريف: شبكة تربط الأجهزة داخل موقع محدود، مثل مبنى واحد.",
    "USB": "المعنى: الناقل التسلسلي العام. التعريف: منفذ يوصل الملحقات ووسائط التخزين القابلة للإزالة.",
    "Ping": "المعنى: اختبار الوصول. التعريف: يرسل رسالة اختبار إلى جهاز ويقيس هل ردّ وكم استغرق الرد.",
    "IoT": "المعنى: إنترنت الأشياء. التعريف: أجهزة غير الحواسيب المعتادة تتصل بالشبكة، مثل الحساسات والكاميرات.",
    "IP": "المعنى: بروتوكول الإنترنت. التعريف: نظام العنونة الذي يوجّه الحزم بين الشبكات.",
    "Telnet": "المعنى: طرفية بعيدة. التعريف: بروتوكول قديم، ويُستخدم بشكل محدود لاختبار قبول منفذ TCP للاتصال.",
    "Cloud": "المعنى: الحوسبة السحابية. التعريف: معالجة أو تخزين أو برامج يقدّمها مزوّد عبر الشبكة بدل إبقائها على الأجهزة المحلية فقط.",
    "Patches": "المعنى: تصحيحات. التعريف: تحديثات تُصلح عيوباً، ومنها الثغرات الأمنية.",
    "Patch": "المعنى: تصحيح. التعريف: تحديث يُصلح عيباً أو ثغرة.",
    "Latency": "المعنى: زمن الاستجابة. التعريف: التأخير بين إرسال الطلب واستلام الرد.",
    "Inbound": "المعنى: الوارد. التعريف: الحركة الداخلة إلى الشبكة أو الجهاز.",
    "Outbound": "المعنى: الصادر. التعريف: الحركة الخارجة من الشبكة أو الجهاز.",
    "Tailgating": "المعنى: التسلل خلف شخص. التعريف: الدخول خلف شخص مصرح له من باب مُتحكَّم به من غير إبراز تصريح.",
    "Usability": "المعنى: قابلية الاستخدام. التعريف: مدى سهولة إتمام العمل الحقيقي على النظام.",
    "Mitigation": "المعنى: التخفيف. التعريف: إجراء يقلل احتمال الخطر أو الضرر الذي يسببه.",
    "Transfer": "المعنى: نقل الخطر. التعريف: تحويل الخطر إلى طرف آخر، عادة بعقد أو تأمين.",
    "Backup": "المعنى: نسخة احتياطية. التعريف: نسخة محفوظة من البيانات يمكن استعادتها بعد الفقد أو التلف.",
    "On-site": "المعنى: في الموقع. التعريف: الحفظ داخل مباني المؤسسة نفسها.",
    "Off-site": "المعنى: خارج الموقع. التعريف: الحفظ في مكان فعلي منفصل عن الأنظمة الأساسية.",
    "Mac": "المعنى: عنوان العتاد. التعريف: العنوان الثابت لواجهة الشبكة. الاسم الكامل Media Access Control.",
    "MAC": "المعنى: عنوان العتاد. التعريف: العنوان الثابت لواجهة الشبكة. الاسم الكامل Media Access Control.",
    "PPP": "المعنى: بروتوكول الربط المباشر. التعريف: بروتوكول يحمل حركة الشبكة عبر وصلة مباشرة.",
    "Explain": "المعنى: اشرح. التعريف: قدّم عرضاً واضحاً لكيفية عمل الشيء أو سببه، مع التعليل، لا مجرد قائمة أسماء.",
    "Assess": "المعنى: قيّم. التعريف: وازن الأهمية أو الاحتمال أو القيمة، ثم اذكر حكماً مبرراً.",
    "Evaluate": "المعنى: قوّم. التعريف: احكم على الفاعلية بمعايير وأدلة، ثم اختم بنتيجة.",
    "Analyse": "المعنى: حلّل. التعريف: فكّك الموقف إلى أجزاء، وبيّن العلاقة بينها، ثم اختم باستنتاج معلّل.",
    "Distinction": "المعنى: الامتياز. التعريف: أعلى تقدير في هذا التقييم، ويُمنح للعمل التحليلي المبرر.",
    "Harvard": "المعنى: أسلوب هارفارد. التعريف: توثيق يذكر المؤلف والتاريخ داخل النص، ثم القائمة الكاملة في النهاية.",
    "Forensic Preservation": "المعنى: حفظ الأدلة الجنائية. التعريف: حماية الأصل والعمل على نسخ مضبوطة حتى يبقى الدليل مقبولاً.",
    "System Recovery": "المعنى: استعادة النظام. التعريف: إعادة الأنظمة إلى حالة موثوقة معروفة بعد الحادث.",
    "Session Timeouts": "المعنى: انتهاء الجلسة. التعريف: إنهاء الجلسة تلقائياً بعد مدة محددة من عدم النشاط.",
    "CBA": "المعنى: تحليل التكلفة والفائدة. التعريف: مقارنة كلفة التدبير بالخسارة التي يُراد تجنبها.",
    "Top 10": "المعنى: أعلى عشرة مخاطر. التعريف: قائمة OWASP المحدَّثة لأهم مخاطر تطبيقات الويب.",
    "Krebs on Security": "المعنى: موقع كريبس الأمني. التعريف: موقع تحقيقي يكتب عن الاختراقات والاحتيال والجرائم السيبرانية.",
    "The Hacker News": "المعنى: ذا هاكر نيوز. التعريف: موقع إخباري ينقل حوادث الأمن السيبراني والثغرات والأبحاث."
  };
  TERMS.forEach(function (term) {
    if (AR[term.key]) term.tip = AR[term.key];
  });

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var tip = document.getElementById("tip");
  var soc = document.getElementById("soc");
  var socText = document.getElementById("soc-text");
  var seal = document.getElementById("seal");
  var sealCopy = document.getElementById("seal-copy");
  var sealFull = sealCopy.textContent.trim();
  var midFull = socText.textContent.trim();
  var typeTimer = 0;

  function annotate(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !/[A-Za-z]/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        var parent = node.parentElement;
        if (!parent || parent.closest("script, style, .term, .no-tip")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var found = [];
      TERMS.forEach(function (term) {
        term.re.lastIndex = 0;
        var match;
        while ((match = term.re.exec(text))) {
          found.push({ start: match.index, end: match.index + match[0].length, tip: term.tip, raw: match[0] });
        }
      });
      if (!found.length) return;
      found.sort(function (a, b) { return a.start - b.start || b.end - b.start - (a.end - a.start); });
      var chosen = [];
      var cursor = 0;
      found.forEach(function (item) {
        if (item.start < cursor) return;
        chosen.push(item);
        cursor = item.end;
      });
      var frag = document.createDocumentFragment();
      var index = 0;
      chosen.forEach(function (item) {
        if (item.start > index) frag.appendChild(document.createTextNode(text.slice(index, item.start)));
        var el = document.createElement("abbr");
        el.className = "term en-term";
        el.tabIndex = 0;
        el.setAttribute("data-tip", item.tip);
        el.textContent = item.raw;
        frag.appendChild(el);
        index = item.end;
      });
      if (index < text.length) frag.appendChild(document.createTextNode(text.slice(index)));
      node.parentNode.replaceChild(frag, node);
    });
    annotateArabic(root);
  }

  function annotateArabic(root) {
    var phrases = [
      ["المركز الوطني للأمن السيبراني في الأردن", "الجهة الحكومية الأردنية المختصة ببناء منظومة الأمن السيبراني الوطنية، ونشر الوعي، ومواجهة التهديدات."],
      ["المركز الوطني الإرشادي للأمن السيبراني", "الذراع الإرشادي للهيئة السعودية، وينشر تنبيهات الثغرات والإجراءات الوقائية بالعربية."],
      ["الهيئة الوطنية للأمن السيبراني", "الجهة المختصة بالأمن السيبراني في السعودية، وتنشر الضوابط والأطر والإرشادات بالعربية."],
      ["الأدلة الجنائية المكتبية", "جمع الأدلة من محطات العمل والخوادم: صور النظام، السجلات، ونشاط المستخدم، من دون إتلاف الأصل."],
      ["الأدلة الجنائية للشبكة", "جمع الأدلة من حركة الشبكة وأجهزة التوجيه والتحويل وجدران الحماية، بإذن مسبق ومنهجية لا تعطّل التشغيل."],
      ["سلسلة الاحتفاظ بالأدلة", "سجل يوثّق من جمع الدليل ومتى وأين حُفظ ومن تسلّمه، حتى يبقى مقبولاً قانونياً."],
      ["النتائج الإيجابية الكاذبة", "تنبيه يشبه الحادث لكنه ليس تهديداً حقيقياً. يجب فحصه قبل تصعيد الاستجابة."],
      ["الدفاع متعدد الطبقات", "وضع أكثر من ضابط حماية متداخل. إذا فشلت طبقة، تبقى الطبقة التالية عائقاً أمام المهاجم."],
      ["خطة التعافي من الكوارث", "خطة مكتوبة لاستعادة الأنظمة الحرجة بعد انقطاع كبير، وفيها المسؤولون ومواقع النسخ والزمن المقبول للتوقف."],
      ["تحليل التكلفة والفائدة", "مقارنة كلفة التدبير بما يُتوقع أن يمنع من خسارة. الرمز الشائع CBA."],
      ["اتفاقيات مستوى الخدمة", "بنود تعاقدية تحدد مستوى الخدمة الذي يلتزم به المزوّد، ومنها الزمن والسرية والمسؤولية."],
      ["اتفاقية مستوى الخدمة", "بند تعاقدي يحدد مستوى الخدمة الذي يلتزم به المزوّد."],
      ["مزودي الخدمة الخارجيين", "جهات من خارج المؤسسة تُتعاقد معها لتقديم خدمة، مثل الاستضافة السحابية."],
      ["مزود خدمة خارجي", "جهة من خارج المؤسسة تُتعاقد معها لتقديم خدمة. الرمز الشائع ESP."],
      ["هدف نقطة الاسترداد", "أقصى قدر من البيانات يُقبل فقده، ويُقاس بالزمن. الرمز RPO."],
      ["هدف وقت الاسترداد", "أقصى زمن يُسمح فيه للنظام أن يبقى متوقفاً. الرمز RTO."],
      ["الذاكرة المتطايرة", "ذاكرة العمل (RAM). محتواها يضيع عند إطفاء الجهاز، لذلك تُلتقط بحذر في بداية التحقيق."],
      ["قابلية الاستخدام", "مدى سهولة إتمام العمل اليومي مع وجود الضوابط الأمنية، من غير تعطيل الخدمة."],
      ["الهندسة الاجتماعية", "خداع شخص حتى يكشف بيانات أو ينفّذ إجراءً ضاراً، بدل كسر النظام تقنياً."],
      ["التصحيحات الأمنية", "تحديثات برمجية تُغلق عيوباً معروفة، ومنها الثغرات."],
      ["المصادقة الثنائية", "إثبات الهوية بعاملين مستقلين، مثل كلمة المرور ورمز مؤقت. الرمز 2FA."],
      ["المصادقة المتعددة", "إثبات الهوية بأكثر من عامل مستقل. الرمز MFA."],
      ["التشفير الشامل", "حماية البيانات بالتشفير في أكثر من مرحلة، أثناء النقل وعند التخزين."],
      ["جدران الحماية", "ضوابط تسمح بحركة الشبكة أو تمنعها وفق قواعد أمنية."],
      ["جدار الحماية", "ضابط، جهاز أو برنامج، يسمح بحركة الشبكة أو يمنعها وفق قواعد."],
      ["برمجيات الفدية", "برنامج خبيث يشفّر الملفات ويطلب مبلغاً مقابل مفتاح الاستعادة. المصطلح Ransomware."],
      ["برمجيات خبيثة", "برامج تُزرع للإضرار أو للتجسس أو للتحكم غير المصرح به."],
      ["المنطقة المحايدة", "جزء من الشبكة يستضيف الخدمات الظاهرة للعموم ويُفصل عن الشبكة الداخلية. الرمز DMZ."],
      ["تجزئة الشبكة", "تقسيم الشبكة إلى أجزاء معزولة حتى لا تنتقل الحركة بحرية بين كل الأجهزة."],
      ["صلاحيات واسعة", "حقوق وصول أكبر مما يحتاجه الشخص لعمله. المصطلح Excessive Privileges."],
      ["سلسلة التجزئة", "في هذا الدليل يقصد بها سلسلة التوريد: الوصول إلى الهدف عبر مورّد أو تحديث أو مكوّن موثوق."],
      ["سطح الهجوم", "كل نقطة يمكن لمهاجم أن يحاول منها الدخول إلى النظام أو استخراج البيانات. المصطلح Attack Surface."],
      ["شدة المخاطر", "ناتج تقدير احتمال وقوع الخطر مضروباً بأثره. شدة المخاطر = الاحتمال × الأثر."],
      ["بيان الموثوقية", "إقرار موقّع بأن العمل من إعداد الطالب نفسه."],
      ["النسخ الاحتياطي", "نسخة محفوظة من البيانات يمكن استعادتها بعد الفقد أو التلف."],
      ["النسخ الاحتياطية", "نسخ محفوظة من البيانات يمكن استعادتها بعد الفقد أو التلف."],
      ["سجلات التدقيق", "سجل للإجراءات ذات الصلة بالأمن، يُراجع لاحقاً لمعرفة ما حدث."],
      ["سجلات النظام", "سجل زمني لما فعله النظام أو التطبيق."],
      ["قائمة السماح", "قائمة بما هو مسموح فقط، ويُرفض ما عداها."],
      ["اليوم الصفر", "ثغرة تُستغل قبل أن يصدر لها إصلاح من الجهة المنتجة. المصطلح Zero-day."],
      ["حقن الأوامر", "إرسال أوامر إلى قاعدة البيانات عبر مدخل لم يُفحص. المصطلح SQL Injection."],
      ["خزانة الشبكة", "الخزانة التي تحوي أجهزة الشبكة. ترك بابها مفتوحاً ثغرة مادية."],
      ["نقاط البيع", "أجهزة تُسجل الدفع لحظة البيع. الرمز POS."],
      ["نقطة البيع", "الجهاز الذي يُسجل الدفع لحظة البيع. الرمز POS."],
      ["الدفاع الأحادي", "الاعتماد على ضابط حماية واحد. إذا سقط، لا يبقى حاجز بعده."],
      ["نواقل الهجوم", "أربعة مسارات رسمية: الواي فاي، وبلوتوث، والإنترنت، والشبكة الداخلية. الهندسة الاجتماعية أسلوب تلاعب بشري، لا ناقل."],
      ["ناقل الهجوم", "أحد المسارات الأربعة: الواي فاي، أو بلوتوث، أو الإنترنت، أو الشبكة الداخلية. المصطلح Attack Vector."],
      ["الاستجابة للحوادث", "الخطوات المنظمة لاكتشاف الحادث واحتوائه واستعادة الخدمة وتوثيق ما حدث."],
      ["كلمات المرور", "سر يعرفه المستخدم لإثبات هويته. السياسة الضعيفة تسهّل التخمين."],
      ["نقل الخطر", "تحويل الخطر إلى طرف آخر بعقد أو تأمين، مثل مزود خدمة خارجي."],
      ["تجنب الخطر", "إيقاف النشاط الذي يسبب الخطر حتى لا يبقى التعرّض قائماً."],
      ["قبول الخطر", "الإقرار بالخطر والمتابعة من غير تدبير إضافي، بقرار واعٍ ومبرر."],
      ["إدارة المخاطر", "تحديد المخاطر وتقديرها ثم اختيار التخفيف أو النقل أو التجنب أو القبول."],
      ["خطة الاختبار", "اختبارات تتحقق من أن التدبير يعمل كما خُطط له قبل الاعتماد عليه."],
      ["الولاية القضائية", "القانون والمحكمة المختصان عند نزاع على البيانات أو العقد."],
      ["الدروس المستفادة", "ما يُستخلص بعد الحادث لتعديل السياسات والتدريب ومنع التكرار."],
      ["إنذار كاذب", "تنبيه يبدو حادثاً ثم يتبين أنه ليس تهديداً حقيقياً."],
      ["استنتاج نقدي", "حكم مسبب يوازن الأثر وفاعلية التدبير، ولا يكتفي بسرد الإجراءات."],
      ["تعطيل الخدمة", "منع المستخدمين الشرعيين من الوصول إلى الخدمة، غالباً بإغراقها بالطلبات."],
      ["البريد العشوائي", "رسائل غير مرغوبة، وقد تحمل رابطاً أو مرفقاً خبيثاً."],
      ["التصيد", "رسالة أو صفحة مصممة لخداع الشخص حتى يكشف بيانات دخوله أو ينفّذ إجراءً ضاراً."],
      ["الثغرات", "نقاط ضعف يمكن استغلالها. تُصنّف وتُربط بناقل الهجوم في هذا الدليل."],
      ["الثغرة", "نقطة ضعف في نظام أو إجراء أو إعداد يمكن استغلالها."],
      ["التهديدات", "أسباب محتملة للضرر، مثل الفدية أو التصيد أو العبث المادي."],
      ["التهديد", "سبب محتمل للضرر على سرية البيانات أو سلامتها أو توفر الخدمة."],
      ["الاحتمال", "مدى توقع وقوع الخطر كما في المصفوفة: غير محتمل، أو محتمل، أو محتمل جداً."],
      ["الأثر", "حجم الضرر إذا وقع الخطر: طفيف، أو متوسط، أو كبير."],
      ["الأولوية", "ترتيب معالجة الخطر بعد حساب شدته. الأعلى شدة يُعالج أولاً."],
      ["التشفير", "تحويل البيانات إلى صيغة لا تُقرأ إلا بمفتاح، أثناء النقل أو عند التخزين."],
      ["المصادقة", "التحقق من أن الشخص أو النظام هو من يدّعي أنه هو."],
      ["داخلي", "من داخل المؤسسة أو شبكتها، مثل موظف أو جهاز على الشبكة الداخلية."],
      ["خارجي", "من خارج المؤسسة، مثل مهاجم عبر الإنترنت أو مزود خدمة خارج الحدود."],
      ["تخفيف", "إجراء يقلل احتمال الخطر أو الضرر الذي يسببه. المصطلح Mitigation."]
    ];

    function boundary(text, index) {
      if (index < 0 || index >= text.length) return true;
      return !/[\u0600-\u06FF]/.test(text.charAt(index));
    }

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !/[\u0600-\u06FF]/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        var parent = node.parentNode;
        if (!parent || parent.closest("script, style, .term, .no-tip, .copy-bar")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var found = [];
      phrases.forEach(function (pair) {
        var phrase = pair[0];
        var from = 0;
        while (from <= text.length - phrase.length) {
          var at = text.indexOf(phrase, from);
          if (at < 0) break;
          if (boundary(text, at - 1) && boundary(text, at + phrase.length)) {
            found.push({ start: at, end: at + phrase.length, tip: pair[1], raw: phrase });
          }
          from = at + phrase.length;
        }
      });
      if (!found.length) return;
      found.sort(function (a, b) { return a.start - b.start || b.end - a.end; });
      var chosen = [];
      var cursor = 0;
      found.forEach(function (item) {
        if (item.start < cursor) return;
        chosen.push(item);
        cursor = item.end;
      });
      var frag = document.createDocumentFragment();
      var index = 0;
      chosen.forEach(function (item) {
        if (item.start > index) frag.appendChild(document.createTextNode(text.slice(index, item.start)));
        var el = document.createElement("abbr");
        el.className = "term";
        el.tabIndex = 0;
        el.setAttribute("data-tip", item.tip);
        el.textContent = item.raw;
        frag.appendChild(el);
        index = item.end;
      });
      if (index < text.length) frag.appendChild(document.createTextNode(text.slice(index)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  function placeTip(el) {
    tip.textContent = el.getAttribute("data-tip");
    tip.hidden = false;
    var rect = el.getBoundingClientRect();
    var width = tip.offsetWidth;
    var height = tip.offsetHeight;
    var x = rect.left + rect.width / 2 - width / 2;
    var y = rect.bottom + 8;
    if (y + height > window.innerHeight - 8) y = rect.top - height - 8;
    x = Math.max(8, Math.min(x, window.innerWidth - width - 8));
    y = Math.max(8, y);
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  }

  function hideTip() { tip.hidden = true; }

  document.getElementById("content").addEventListener("mouseover", function (event) {
    var el = event.target.closest(".term");
    if (el) placeTip(el);
  });
  document.getElementById("content").addEventListener("mouseout", function (event) {
    var el = event.target.closest(".term");
    if (el) hideTip();
  });
  document.getElementById("content").addEventListener("focusin", function (event) {
    var el = event.target.closest(".term");
    if (el) placeTip(el);
  });
  document.getElementById("content").addEventListener("focusout", hideTip);

  function typeInto(el, text, done) {
    window.clearInterval(typeTimer);
    if (reduced) {
      el.textContent = text;
      if (done) done();
      return;
    }
    var i = 0;
    el.textContent = "";
    typeTimer = window.setInterval(function () {
      el.textContent += text.charAt(i);
      i += 1;
      if (i >= text.length) {
        window.clearInterval(typeTimer);
        if (done) done();
      }
    }, 16);
  }

  var soundOn = localStorage.getItem("u11-sound") !== "0";
  var audioCtx = null;

  function ensureAudio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function beep(freq, at, dur, type, level) {
    if (!soundOn) return;
    var ctx = ensureAudio();
    if (!ctx) return;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var t = ctx.currentTime + at;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(level, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  function playAccess() {
    beep(392, 0, 0.09, "triangle", 0.05);
    beep(523, 0.09, 0.1, "triangle", 0.055);
    beep(784, 0.18, 0.18, "sine", 0.045);
  }

  function playTick(on) {
    beep(on ? 880 : 280, 0, 0.05, "triangle", 0.032);
  }

  function playRow() {
    beep(640, 0, 0.03, "sine", 0.018);
  }

  function playAlert() {
    beep(660, 0, 0.08, "square", 0.022);
    beep(880, 0.1, 0.12, "square", 0.022);
  }

  function playSeal() {
    beep(523, 0, 0.12, "triangle", 0.05);
    beep(659, 0.11, 0.12, "triangle", 0.05);
    beep(784, 0.22, 0.2, "sine", 0.05);
  }

  function paintSound() {
    ["sound-gate", "sound-top"].forEach(function (id) {
      var btn = document.getElementById(id);
      if (!btn) return;
      btn.setAttribute("aria-pressed", soundOn ? "true" : "false");
      btn.textContent = soundOn ? "الصوت يعمل" : "الصوت صامت";
    });
  }

  function toggleSound() {
    soundOn = !soundOn;
    localStorage.setItem("u11-sound", soundOn ? "1" : "0");
    paintSound();
    if (soundOn) playTick(true);
  }

  paintSound();
  document.getElementById("sound-gate").addEventListener("click", toggleSound);
  document.getElementById("sound-top").addEventListener("click", toggleSound);

  var theme = localStorage.getItem("u11-theme") === "light" ? "light" : "dark";

  function applyTheme() {
    var light = theme === "light";
    if (light) document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
    var meta = document.querySelector("meta[name='theme-color']");
    if (meta) meta.setAttribute("content", light ? "#e7eee9" : "#07090d");
    ["theme-gate", "theme-top"].forEach(function (id) {
      var btn = document.getElementById(id);
      if (!btn) return;
      btn.setAttribute("aria-pressed", light ? "true" : "false");
      btn.textContent = light ? "وضع داكن" : "وضع فاتح";
    });
  }

  function toggleTheme() {
    theme = theme === "light" ? "dark" : "light";
    localStorage.setItem("u11-theme", theme);
    applyTheme();
  }

  applyTheme();
  document.getElementById("theme-gate").addEventListener("click", toggleTheme);
  document.getElementById("theme-top").addEventListener("click", toggleTheme);

  function showMid() {
    if (sessionStorage.getItem("u11-mid") === "1" && !showMid.force) return;
    sessionStorage.setItem("u11-mid", "1");
    showMid.force = false;
    playAlert();
    soc.hidden = false;
    typeInto(socText, midFull);
  }

  function showSeal() {
    if (sessionStorage.getItem("u11-seal") === "1" && !showSeal.force) return;
    if (soc.hidden === false && sessionStorage.getItem("u11-mid") !== "1") return;
    sessionStorage.setItem("u11-seal", "1");
    showSeal.force = false;
    playSeal();
    if (typeof seal.showModal === "function") { if (!seal.open) seal.showModal(); }
    else seal.setAttribute("open", "");
    typeInto(sealCopy, sealFull);
  }

  document.getElementById("soc-close").addEventListener("click", function () {
    window.clearInterval(typeTimer);
    soc.hidden = true;
  });
  document.getElementById("seal-close").addEventListener("click", function () {
    window.clearInterval(typeTimer);
    if (typeof seal.close === "function") seal.close();
  });
  seal.addEventListener("close", function () { window.clearInterval(typeTimer); });
  document.getElementById("replay-mid").addEventListener("click", function () {
    showMid.force = true;
    sessionStorage.removeItem("u11-mid");
    showMid();
  });
  document.getElementById("replay-seal").addEventListener("click", function () {
    showSeal.force = true;
    sessionStorage.removeItem("u11-seal");
    showSeal();
  });

  var side = document.getElementById("side");
  var scrim = document.getElementById("scrim");
  var menu = document.getElementById("menu");
  function closeMenu() {
    side.classList.remove("open");
    scrim.classList.remove("show");
    menu.setAttribute("aria-expanded", "false");
  }
  menu.addEventListener("click", function () {
    var open = side.classList.toggle("open");
    scrim.classList.toggle("show", open);
    menu.setAttribute("aria-expanded", open ? "true" : "false");
  });
  scrim.addEventListener("click", closeMenu);
  side.addEventListener("click", function (event) {
    if (event.target.closest("a, .nav-item")) closeMenu();
  });

  function tick() {
    var now = new Date();
    document.getElementById("clock").textContent = now.toLocaleTimeString("en-GB", { hour12: false });
  }
  tick();
  window.setInterval(tick, 1000);

  var shots = Array.prototype.slice.call(document.querySelectorAll(".diagram button"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-cap");
  var lbIndex = 0;

  function openShot(index) {
    lbIndex = index;
    var button = shots[index];
    lbImg.src = button.getAttribute("data-full");
    lbImg.alt = button.querySelector("img").alt;
    lbCap.textContent = button.getAttribute("data-caption");
    lightbox.hidden = false;
  }
  shots.forEach(function (button, index) {
    button.addEventListener("click", function () { openShot(index); });
  });
  document.getElementById("lb-close").addEventListener("click", function () { lightbox.hidden = true; lbImg.src = ""; });
  document.getElementById("lb-prev").addEventListener("click", function () {
    openShot((lbIndex - 1 + shots.length) % shots.length);
  });
  document.getElementById("lb-next").addEventListener("click", function () {
    openShot((lbIndex + 1) % shots.length);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      lightbox.hidden = true;
      hideTip();
    }
  });

  var guide = document.getElementById("content");
  if (window.placeGuideQuestions) window.placeGuideQuestions(guide);
  annotate(guide);
  groupTerms(guide);

  function groupTerms(root) {
    var starters = [];
    Array.prototype.forEach.call(root.querySelectorAll("abbr.term.en-term"), function (term) {
      if (term.closest(".en-run")) return;
      var prev = term.previousSibling;
      var glued = prev && prev.nodeType === 3 && /^[\s,./&+\-:;]*$/.test(prev.nodeValue) && prev.previousSibling && prev.previousSibling.classList && prev.previousSibling.classList.contains("term");
      if (!glued) starters.push(term);
    });
    starters.forEach(function (start) {
      var nodes = [start];
      var n = start.nextSibling;
      while (n) {
        if (n.nodeType === 3 && /^[\s,./&+\-:;]*$/.test(n.nodeValue || "")) {
          var nx = n.nextSibling;
          if (nx && nx.classList && nx.classList.contains("en-term")) {
            nodes.push(n, nx);
            n = nx.nextSibling;
            continue;
          }
        }
        break;
      }
      if (nodes.filter(function (node) { return node.nodeType === 1; }).length < 2) return;
      var prev = nodes[0].previousSibling;
      if (prev && prev.nodeType === 3) {
        var open = prev.nodeValue.match(/^(.*?)(\(\s*)$/);
        if (open && open[2]) {
          prev.nodeValue = open[1];
          var openNode = document.createTextNode(open[2]);
          nodes[0].parentNode.insertBefore(openNode, nodes[0]);
          nodes.unshift(openNode);
        }
      }
      var last = nodes[nodes.length - 1];
      var next = last.nextSibling;
      if (next && next.nodeType === 3) {
        var close = next.nodeValue.match(/^(\s*\))([\s\S]*)$/);
        if (close) {
          var closeNode = document.createTextNode(close[1]);
          next.nodeValue = close[2];
          last.parentNode.insertBefore(closeNode, next);
          nodes.push(closeNode);
        }
      }
      var wrap = document.createElement("bdi");
      wrap.dir = "ltr";
      wrap.className = "en-run";
      nodes[0].parentNode.insertBefore(wrap, nodes[0]);
      nodes.forEach(function (node) { wrap.appendChild(node); });
    });
  }

  var STORE = "u11-stages-v2";
  var STAGES = [
    { id: "cover", group: "التمهيد", nav: "غلاف الدليل", code: "00", sel: ["#cover"], read: true },
    { id: "intro", group: "التمهيد", nav: "المقدمة والإرشادات", code: "01", sel: ["#intro"], read: true },
    { id: "act1", group: "PayWave", nav: "افتتاح PayWave", code: "02", sel: ["#plan", "#act1"] },
    { id: "ap1", group: "PayWave", nav: "التهديدات", code: "03", sel: ["#ap1"] },
    { id: "ap2", group: "PayWave", nav: "الثغرات", code: "04", sel: ["#ap2"] },
    { id: "ap3", group: "PayWave", nav: "التدابير", code: "05", sel: ["#ap3"] },
    { id: "bp", group: "PayWave", nav: "الشبكات", code: "06", sel: ["#bp"] },
    { id: "am", group: "PayWave", nav: "التقييم", code: "07", sel: ["#am"] },
    { id: "act2", group: "Clearwater", nav: "افتتاح المركز", code: "08", sel: ["#act2"] },
    { id: "cp6", group: "Clearwater", nav: "المخاطر", code: "09", sel: ["#cp6"] },
    { id: "cp7", group: "Clearwater", nav: "خطة الأمن", code: "10", sel: ["#cp7"] },
    { id: "cd", group: "Clearwater", nav: "السياسات والأدلة", code: "11", sel: ["#cd", "#dp"] },
    { id: "end", group: "الإغلاق", nav: "تسليم الملفين", code: "END", sel: ["#guide-end"] }
  ];
  var state = loadState();
  var current = 0;
  var onlyLeft = false;
  var navEl = document.getElementById("nav");
  var fracEl = document.getElementById("frac");
  var remainEl = document.getElementById("remain");
  var meterEl = document.getElementById("meter");
  var chipsEl = document.getElementById("chips");
  var prevBtn = document.getElementById("prev");
  var nextBtn = document.getElementById("next");
  var whoEl = document.getElementById("who");

  function loadState() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE) || "null");
      if (saved && saved.checks) {
        saved.rows = saved.rows || {};
        if (saved.layout !== 3) {
          Object.keys(saved.checks).forEach(function (key) {
            if (key.indexOf("ap3:") === 0) delete saved.checks[key];
          });
          saved.layout = 3;
        }
        if (saved.layout !== 4) {
          Object.keys(saved.checks).forEach(function (key) {
            if (key.indexOf("cp7:") === 0) delete saved.checks[key];
          });
          saved.layout = 4;
        }
        if (saved.layout !== 5) {
          Object.keys(saved.checks).forEach(function (key) {
            if (key.indexOf("cd:") === 0) delete saved.checks[key];
          });
          saved.layout = 5;
        }
        if (saved.layout !== 6) {
          Object.keys(saved.checks).forEach(function (key) {
            if (key.indexOf("ap2:") === 0 || key.indexOf("act2:") === 0 || key.indexOf("cp6:") === 0) delete saved.checks[key];
          });
          saved.layout = 6;
        }
        if (saved.layout !== 7) {
          Object.keys(saved.checks).forEach(function (key) {
            if (key.indexOf("bp:") === 0 || key.indexOf("am:") === 0 || key.indexOf("cp7:") === 0 || key.indexOf("cd:") === 0) delete saved.checks[key];
          });
          saved.rows = {};
          saved.layout = 7;
        }
        if (saved.layout !== 8) {
          Object.keys(saved.checks).forEach(function (key) {
            if (key.indexOf("ap1:") === 0) delete saved.checks[key];
          });
          saved.rows = {};
          saved.layout = 8;
        }
        return saved;
      }
      var older = JSON.parse(localStorage.getItem("u11-stages-v1") || "null");
      if (older && older.name) return { name: older.name, klass: older.klass || "", checks: {}, rows: {}, currentId: "" };
    } catch (err) {}
    return { name: "", klass: "", checks: {}, rows: {}, currentId: "" };
  }

  function saveState() {
    state.currentId = STAGES[current] ? STAGES[current].id : state.currentId;
    localStorage.setItem(STORE, JSON.stringify(state));
    if (window.U11Track && window.U11Track.sync) window.U11Track.sync();
  }

  function pointTitle(point, fallback) {
    var head = point.querySelector("h2, h3, h4");
    var title = head ? head.textContent.replace(/\s+/g, " ").trim() : "";
    if (!title) {
      var para = point.querySelector("p");
      title = para ? para.textContent.replace(/\s+/g, " ").trim().slice(0, 90) : "";
    }
    return title || fallback;
  }

  function isHeading(el) {
    return /^H[2-4]$/.test(el.tagName);
  }

  function isBlock(el) {
    return el.classList.contains("table-wrap") || el.classList.contains("figures") || el.classList.contains("steps") || el.classList.contains("model");
  }

  function isProse(el) {
    return el.tagName === "P" || el.classList.contains("brief");
  }

  function glueOnly(nodes) {
    return nodes.length > 0 && nodes.every(function (el) {
      return el.classList.contains("brief") || el.classList.contains("formula") || el.classList.contains("file");
    });
  }

  function hasWork(nodes) {
    return nodes.some(function (el) {
      if (isHeading(el) || el.classList.contains("file") || el.classList.contains("think")) return false;
      if (el.id === "refs-slot" || el.classList.contains("sources")) return false;
      return true;
    });
  }

  function lastSolid(nodes) {
    for (var i = nodes.length - 1; i >= 0; i -= 1) {
      if (!nodes[i].classList.contains("think")) return nodes[i];
    }
    return null;
  }

  function groupsIn(container) {
    var kids = Array.prototype.filter.call(container.children, function (el) {
      return !el.classList.contains("footer") && !el.classList.contains("replay");
    });
    var groups = [];
    var current = [];
    function flush() {
      if (current.length) groups.push(current);
      current = [];
    }
    kids.forEach(function (el) {
      var last = lastSolid(current);
      var split = current.length && (isHeading(el) || (last && isBlock(last) && isProse(el)));
      if (split) flush();
      current.push(el);
    });
    flush();
    var merged = [];
    groups.forEach(function (group) {
      if (merged.length && merged[merged.length - 1].every(isHeading)) {
        merged[merged.length - 1] = merged[merged.length - 1].concat(group);
      } else if (glueOnly(group) && merged.length) {
        merged[merged.length - 1] = merged[merged.length - 1].concat(group);
      } else {
        merged.push(group);
      }
    });
    return merged.filter(hasWork);
  }

  function wrapNodes(nodes, key) {
    nodes.forEach(function (node) {
      if (node.matches && node.matches("li")) {
        var oldBox = node.querySelector("input[type=checkbox]");
        if (oldBox) oldBox.remove();
      }
    });
    var point = document.createElement("div");
    point.className = "point";
    var label = document.createElement("label");
    label.className = "tick-label";
    var input = document.createElement("input");
    input.type = "checkbox";
    input.checked = !!state.checks[key];
    var word = document.createElement("span");
    word.textContent = "تم";
    var wait = document.createElement("span");
    wait.className = "tick-wait";
    wait.textContent = "بعد الصفوف";
    label.appendChild(input);
    label.appendChild(word);
    label.appendChild(wait);
    var copy = document.createElement("div");
    copy.className = "point-copy";
    nodes[0].parentNode.insertBefore(point, nodes[0]);
    nodes.forEach(function (node) { copy.appendChild(node); });
    point.dataset.key = key;
    point.appendChild(label);
    point.appendChild(copy);
    point.classList.toggle("is-done", input.checked);
    input.addEventListener("change", function () {
      state.checks[key] = input.checked;
      if (!input.checked) delete state.checks[key];
      point.classList.toggle("is-done", input.checked);
      playTick(input.checked);
      saveState();
      paint();
      if (paywaveDone()) showMid();
      if (closingDone()) showSeal();
    });
    return point;
  }

  var COPY_NOTE = "تم نسخ إطار الجدول وعناوينه فقط. الخلايا فارغة: املأها بأسلوبك قبل أن تضعها في التقرير.";

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function tableFrame(table) {
    var headRow = table.querySelector("thead tr") || table.querySelector("tr");
    var headers = [];
    if (headRow) {
      headRow.querySelectorAll("th, td").forEach(function (cell) {
        if (cell.classList.contains("row-mark-h")) return;
        headers.push(cell.innerText.replace(/\s+/g, " ").trim());
      });
    }
    var rows = table.querySelectorAll("tbody tr").length;
    if (!rows) rows = Math.max(table.querySelectorAll("tr").length - 1, 1);
    return { headers: headers, rows: rows };
  }

  function frameHtml(frame) {
    var cell = "border:1px solid #1a1a1a;padding:6px;vertical-align:top;";
    var heads = frame.headers.map(function (header) {
      return "<th style=\"" + cell + "background:#f3f4f6;font-weight:700;\">" + escapeHtml(header) + "</th>";
    }).join("");
    var empty = frame.headers.map(function () {
      return "<td style=\"" + cell + "\">&nbsp;</td>";
    }).join("");
    var body = "";
    for (var i = 0; i < frame.rows; i++) body += "<tr>" + empty + "</tr>";
    return "<table dir=\"rtl\" border=\"1\" cellspacing=\"0\" cellpadding=\"6\" style=\"border-collapse:collapse;direction:rtl;width:100%;\">" +
      "<thead><tr>" + heads + "</tr></thead><tbody>" + body + "</tbody></table>";
  }

  function frameText(frame) {
    var blank = frame.headers.map(function () { return ""; }).join("\t");
    var lines = [frame.headers.join("\t")];
    for (var i = 0; i < frame.rows; i++) lines.push(blank);
    return lines.join("\n");
  }

  function copyTable(table, note) {
    var frame = tableFrame(table);
    var html = frameHtml(frame);
    var text = frameText(frame);
    var show = function () {
      note.hidden = false;
      note.textContent = COPY_NOTE;
    };
    var fallback = function () {
      var holder = document.createElement("div");
      holder.setAttribute("contenteditable", "true");
      holder.innerHTML = html;
      holder.style.position = "fixed";
      holder.style.left = "-9999px";
      document.body.appendChild(holder);
      var range = document.createRange();
      range.selectNodeContents(holder);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      try { document.execCommand("copy"); show(); } catch (err) {}
      selection.removeAllRanges();
      holder.remove();
    };
    if (navigator.clipboard && window.ClipboardItem && navigator.clipboard.write) {
      var item = new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" })
      });
      navigator.clipboard.write([item]).then(show).catch(fallback);
    } else {
      fallback();
    }
  }

  function addCopyButtons(root) {
    root.querySelectorAll("table").forEach(function (table) {
      var bar = document.createElement("div");
      bar.className = "copy-bar no-tip";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "نسخ الجدول";
      var note = document.createElement("p");
      note.className = "copy-note";
      note.hidden = true;
      btn.addEventListener("click", function () {
        note.hidden = false;
        note.textContent = COPY_NOTE;
        copyTable(table, note);
      });
      var tally = document.createElement("span");
      tally.className = "row-count";
      bar.appendChild(btn);
      bar.appendChild(tally);
      bar.appendChild(note);
      var wrap = table.closest(".table-wrap");
      if (wrap && wrap.parentNode) wrap.parentNode.insertBefore(bar, wrap);
      else table.parentNode.insertBefore(bar, table);
    });
  }

  function paintRowCount(table) {
    var wrap = table.closest(".table-wrap");
    var bar = wrap ? wrap.previousElementSibling : table.previousElementSibling;
    var count = bar && bar.querySelector(".row-count");
    if (!count) return;
    var total = table.querySelectorAll("tbody tr").length;
    var done = table.querySelectorAll("tbody tr.is-tracked").length;
    count.innerHTML = "<bdi dir=\"ltr\">" + done + " / " + total + "</bdi> صفوف";
    count.classList.toggle("is-full", total > 0 && done === total);
  }

  function addRowMarks(root) {
    state.rows = state.rows || {};
    var tables = root.querySelectorAll("table");
    Array.prototype.forEach.call(tables, function (table, tableIndex) {
      var head = table.querySelector("thead tr");
      if (head && !head.querySelector(".row-mark-h")) {
        var th = document.createElement("th");
        th.className = "row-mark-h";
        th.textContent = "تابعت";
        th.title = "علّم الصف بعد أن تكتبه في تقريرك";
        head.insertBefore(th, head.firstChild);
      }
      Array.prototype.forEach.call(table.querySelectorAll("tbody tr"), function (row, rowIndex) {
        if (row.querySelector(".row-mark")) return;
        var key = tableIndex + ":" + rowIndex;
        var cell = document.createElement("td");
        cell.className = "row-mark";
        var tick = document.createElement("input");
        tick.type = "checkbox";
        tick.className = "row-tick";
        tick.setAttribute("aria-label", "تعليم الصف " + (rowIndex + 1));
        var on = !!state.rows[key];
        tick.checked = on;
        row.classList.toggle("is-tracked", on);
        tick.addEventListener("change", function () {
          if (tick.checked) state.rows[key] = 1;
          else delete state.rows[key];
          row.classList.toggle("is-tracked", tick.checked);
          playRow();
          saveState();
          paintRowCount(table);
          var point = row.closest(".point");
          if (point && syncParent(point)) paint();
        });
        cell.appendChild(tick);
        row.insertBefore(cell, row.firstChild);
      });
      paintRowCount(table);
    });
    syncParents();
  }

  function syncParent(point) {
    var input = point.querySelector(".tick-label input");
    var label = point.querySelector(".tick-label");
    if (!input || !label) return false;
    var ticks = point.querySelectorAll(".row-tick");
    if (!ticks.length) {
      input.disabled = false;
      input.title = "";
      label.classList.remove("is-locked");
      return false;
    }
    var open = Array.prototype.every.call(ticks, function (tick) { return tick.checked; });
    input.disabled = !open;
    input.title = open ? "" : "علّم كل صفوف هذا الجزء أولاً";
    label.classList.toggle("is-locked", !open);
    if (!open && input.checked) {
      input.checked = false;
      point.classList.remove("is-done");
      delete state.checks[point.dataset.key];
      return true;
    }
    return false;
  }

  function syncParents() {
    var changed = false;
    document.querySelectorAll(".point").forEach(function (point) {
      if (syncParent(point)) changed = true;
    });
    if (changed) saveState();
  }

  function buildStages() {
    var host = document.getElementById("wrap");
    STAGES.forEach(function (stage) {
      var page = document.createElement("div");
      page.className = "stage-page";
      page.id = "stage-" + stage.id;
      page.hidden = true;
      stage.sel.forEach(function (selector) {
        var node = document.querySelector(selector);
        if (node) page.appendChild(node);
      });
      host.appendChild(page);
      stage.page = page;
      stage.points = [];
      if (stage.read) return;
      Array.prototype.forEach.call(page.querySelectorAll(".body, .cover-break"), function (container) {
        groupsIn(container).forEach(function (nodes) {
          var work = nodes.filter(function (el) { return el.tagName !== "H2"; });
          if (!hasWork(work)) return;
          stage.points.push(wrapNodes(work, stage.id + ":" + stage.points.length));
        });
      });
    });
    addCopyButtons(host);
    addRowMarks(host);
    host.querySelectorAll("aside.think").forEach(function (box) {
      if (!box.closest(".point") && !box.closest("#stage-intro")) box.remove();
    });
  }

  function stageDone(stage) {
    return stage.points.every(function (point) {
      return point.querySelector("input").checked;
    });
  }

  function paywaveDone() {
    return STAGES.every(function (stage) {
      if (stage.group !== "PayWave") return true;
      return stageDone(stage);
    });
  }

  function pointsLeft(stage) {
    return stage.points.filter(function (point) {
      return !point.querySelector("input").checked;
    }).length;
  }

  function workStages() {
    return STAGES.filter(function (stage) { return !stage.read; });
  }

  function stagesDoneCount() {
    return workStages().filter(stageDone).length;
  }

  function closingDone() {
    return STAGES.some(function (stage) {
      return stage.id === "end" && stage.points.length > 0 && stageDone(stage);
    });
  }

  function paint() {
    var work = workStages();
    var done = stagesDoneCount();
    var total = work.length;
    var pointsOpen = work.reduce(function (sum, stage) { return sum + pointsLeft(stage); }, 0);
    fracEl.innerHTML = done + " <span>/ " + total + "</span>";
    remainEl.textContent = "المتبقي " + (total - done) + " مرحلة · " + pointsOpen + " بند";
    meterEl.style.width = (total ? (done / total) * 100 : 0) + "%";
    document.documentElement.style.setProperty("--read", String(total ? done / total : 0));
    document.getElementById("progress-label").textContent = (total ? Math.round((done / total) * 100) : 0) + "%";
    var groups = [];
    workStages().forEach(function (stage) {
      var found = groups.filter(function (item) { return item.name === stage.group; })[0];
      if (!found) {
        found = { name: stage.group, total: 0, done: 0 };
        groups.push(found);
      }
      found.total += 1;
      if (stageDone(stage)) found.done += 1;
    });
    chipsEl.innerHTML = "";
    groups.forEach(function (group) {
      var chip = document.createElement("b");
      chip.appendChild(document.createTextNode(group.name + " "));
      var num = document.createElement("bdi");
      num.dir = "ltr";
      num.textContent = group.done + " / " + group.total;
      chip.appendChild(num);
      chipsEl.appendChild(chip);
    });
    var buttons = navEl.querySelectorAll(".nav-item");
    Array.prototype.forEach.call(buttons, function (btn, index) {
      var stage = STAGES[index];
      var read = !!stage.read;
      var left = read ? 0 : pointsLeft(stage);
      btn.classList.toggle("current", index === current);
      btn.classList.toggle("done", !read && left === 0);
      btn.classList.toggle("is-read", read);
      btn.classList.toggle("hidden-row", onlyLeft && index !== current && (read || left === 0));
      btn.querySelector(".left").textContent = read ? "قراءة" : (left === 0 ? "تم" : String(left));
    });
    navEl.querySelectorAll(".nav-group").forEach(function (label) {
      var any = false;
      var node = label.nextElementSibling;
      while (node && !node.classList.contains("nav-group")) {
        if (!node.classList.contains("hidden-row")) any = true;
        node = node.nextElementSibling;
      }
      label.hidden = onlyLeft && !any;
    });
    var stage = STAGES[current];
    var leftHere = stage.read ? 0 : pointsLeft(stage);
    var last = current === STAGES.length - 1;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = leftHere > 0 || last;
    nextBtn.textContent = leftHere > 0
      ? "علّم " + leftHere + (last ? " لإنهاء الدليل" : " للانتقال")
      : (last ? "أتممت المراحل" : "المرحلة التالية");
  }

  function renderNav() {
    navEl.innerHTML = "";
    var lastGroup = "";
    STAGES.forEach(function (stage, index) {
      if (stage.group !== lastGroup) {
        lastGroup = stage.group;
        var label = document.createElement("div");
        label.className = "nav-group";
        label.dataset.group = stage.group;
        label.textContent = stage.group;
        navEl.appendChild(label);
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-item";
      var no = document.createElement("span");
      no.className = "no";
      no.textContent = stage.code;
      var title = document.createElement("span");
      title.className = "title";
      title.textContent = stage.nav;
      var left = document.createElement("span");
      left.className = "left";
      btn.appendChild(no);
      btn.appendChild(title);
      btn.appendChild(left);
      btn.addEventListener("click", function () { show(index); });
      navEl.appendChild(btn);
    });
  }

  function show(index) {
    current = Math.max(0, Math.min(STAGES.length - 1, index));
    STAGES.forEach(function (stage, i) { stage.page.hidden = i !== current; });
    saveState();
    paint();
    if (STAGES[current].id === "act2" && paywaveDone()) showMid();
    if (closingDone()) showSeal();
    var active = navEl.querySelectorAll(".nav-item")[current];
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest" });
    window.scrollTo(0, 0);
  }

  function startSession(name, klass) {
    state.name = name;
    state.klass = klass;
    document.body.classList.add("ready");
    whoEl.textContent = name + (klass ? " · " + klass : "");
    renderNav();
    var found = STAGES.findIndex(function (stage) { return stage.id === state.currentId; });
    show(found >= 0 ? found : 0);
  }

  buildStages();

  document.getElementById("gate-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var nameInput = document.getElementById("student-name");
    var name = nameInput.value.trim();
    var hint = document.getElementById("gate-hint");
    if (name.length < 2) {
      hint.textContent = "اكتب اسمك حتى نبدأ.";
      nameInput.focus();
      return;
    }
    hint.textContent = "";
    playAccess();
    startSession(name, document.getElementById("student-class").value.trim());
  });

  document.getElementById("edit-name").addEventListener("click", function () {
    document.getElementById("student-name").value = state.name || "";
    document.getElementById("student-class").value = state.klass || "";
    document.body.classList.remove("ready");
  });

  document.getElementById("only-left").addEventListener("click", function () {
    onlyLeft = !onlyLeft;
    this.textContent = onlyLeft ? "كل المراحل" : "المتبقي فقط";
    paint();
  });

  document.getElementById("reset").addEventListener("click", function () {
    if (!window.confirm("مسح تعليم البنود وصفوف الجداول والبدء من المرحلة الأولى؟ الاسم يبقى محفوظاً.")) return;
    state.checks = {};
    state.rows = {};
    document.querySelectorAll("tr.is-tracked").forEach(function (row) { row.classList.remove("is-tracked"); });
    document.querySelectorAll(".row-tick").forEach(function (tick) { tick.checked = false; });
    document.querySelectorAll("table").forEach(paintRowCount);
    syncParents();
    state.currentId = STAGES[0].id;
    saveState();
    STAGES.forEach(function (stage) {
      stage.points.forEach(function (point) {
        var input = point.querySelector("input");
        input.checked = false;
        point.classList.remove("is-done");
      });
    });
    show(0);
  });

  prevBtn.addEventListener("click", function () { if (current > 0) show(current - 1); });
  nextBtn.addEventListener("click", function () {
    if (nextBtn.disabled) return;
    show(current + 1);
  });

  if (state.name) {
    document.getElementById("student-name").value = state.name;
    document.getElementById("student-class").value = state.klass || "";
  }

  window.U11Guide = {
    snapshot: function () {
      var stage = STAGES[current] || {};
      var work = workStages();
      var done = stagesDoneCount();
      var total = work.length;
      var pointsDone = 0;
      var pointsTotal = 0;
      var stages = STAGES.map(function (item) {
        var pts = item.points.map(function (point, index) {
          var box = point.querySelector(".tick-label input");
          return {
            key: point.dataset.key,
            title: pointTitle(point, item.nav + " " + (index + 1)),
            done: !!(box && box.checked)
          };
        });
        var itemDone = pts.filter(function (pt) { return pt.done; }).length;
        if (!item.read) {
          pointsTotal += pts.length;
          pointsDone += itemDone;
        }
        return {
          id: item.id,
          group: item.group,
          nav: item.nav,
          code: item.code,
          read: !!item.read,
          pointsTotal: pts.length,
          pointsDone: itemDone,
          done: item.read ? false : (pts.length > 0 && itemDone === pts.length),
          points: pts
        };
      });
      return {
        name: state.name || "",
        klass: state.klass || "",
        currentId: stage.id || "",
        currentNav: stage.nav || "",
        currentCode: stage.code || "",
        currentGroup: stage.group || "",
        percent: total ? Math.round((done / total) * 100) : 0,
        stagesDone: done,
        stagesTotal: total,
        pointsDone: pointsDone,
        pointsTotal: pointsTotal,
        pointsLeft: pointsTotal - pointsDone,
        rowsDone: Object.keys(state.rows || {}).length,
        stages: stages
      };
    }
  };
})();
