--
-- PostgreSQL database dump
--

\restrict KcYYnwb78BxNI1od2E0iDM5W7wzxvwgTR9igNloZ9gnuCRcJgYJ8lO8va76NnBE

-- Dumped from database version 14.23 (Ubuntu 14.23-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.23 (Ubuntu 14.23-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: EmploymentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EmploymentType" AS ENUM (
    'FULL_TIME',
    'PART_TIME',
    'CONTRACT',
    'INTERNSHIP'
);


ALTER TYPE public."EmploymentType" OWNER TO postgres;

--
-- Name: JobStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."JobStatus" AS ENUM (
    'DRAFT',
    'ACTIVE',
    'ARCHIVED'
);


ALTER TYPE public."JobStatus" OWNER TO postgres;

--
-- Name: JobType; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public."JobType" AS ENUM (
    'FULL_TIME',
    'PART_TIME',
    'CONTRACT',
    'INTERNSHIP',
    'REMOTE',
    'HYBRID'
);


ALTER TYPE public."JobType" OWNER TO "user";

--
-- Name: Role; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public."Role" AS ENUM (
    'RECRUITER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO "user";

--
-- Name: SectionType; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public."SectionType" AS ENUM (
    'HERO',
    'ABOUT_US',
    'CULTURE_VIDEO',
    'VALUES',
    'PERKS_BENEFITS',
    'OPEN_ROLES',
    'CUSTOM_TEXT',
    'IMAGE_TEXT',
    'GALLERY',
    'CTA'
);


ALTER TYPE public."SectionType" OWNER TO "user";

--
-- Name: WorkMode; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."WorkMode" AS ENUM (
    'ON_SITE',
    'HYBRID',
    'REMOTE'
);


ALTER TYPE public."WorkMode" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Application; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Application" (
    id text NOT NULL,
    "jobId" text NOT NULL,
    "companyId" text NOT NULL,
    "candidateName" text NOT NULL,
    "candidateEmail" text NOT NULL,
    "resumeUrl" text,
    "coverLetter" text,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Application" OWNER TO postgres;

--
-- Name: CareersPage; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."CareersPage" (
    id text NOT NULL,
    "companyId" text NOT NULL,
    "metaTitle" text,
    "metaDescription" text,
    "isPublished" boolean DEFAULT false NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CareersPage" OWNER TO "user";

--
-- Name: Company; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."Company" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "logoUrl" text,
    "bannerUrl" text,
    "primaryColor" text DEFAULT '#2563eb'::text NOT NULL,
    "secondaryColor" text DEFAULT '#1e293b'::text NOT NULL,
    "fontFamily" text DEFAULT 'Inter'::text NOT NULL,
    tagline text,
    "aboutText" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "cornerRadius" integer DEFAULT 12 NOT NULL,
    "sectionSpacing" text DEFAULT '3.5rem'::text NOT NULL,
    "companySize" text,
    "cultureVideoUrl" text,
    description text,
    industry text,
    location text,
    website text
);


ALTER TABLE public."Company" OWNER TO "user";

--
-- Name: Department; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."Department" (
    id text NOT NULL,
    name text NOT NULL,
    "companyId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Department" OWNER TO "user";

--
-- Name: Job; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."Job" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    "jobType" public."JobType" DEFAULT 'FULL_TIME'::public."JobType" NOT NULL,
    "isPublished" boolean DEFAULT true NOT NULL,
    "companyId" text NOT NULL,
    "departmentId" text,
    "locationId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    benefits text[] DEFAULT ARRAY[]::text[],
    currency text DEFAULT 'USD'::text,
    "datePosted" timestamp(3) without time zone,
    "departmentName" text DEFAULT 'General'::text NOT NULL,
    "employmentType" public."EmploymentType" DEFAULT 'FULL_TIME'::public."EmploymentType" NOT NULL,
    "expiryDate" timestamp(3) without time zone,
    "locationCity" text DEFAULT 'Remote'::text NOT NULL,
    "locationCountry" text DEFAULT 'Global'::text NOT NULL,
    "preferredSkills" text[] DEFAULT ARRAY[]::text[],
    requirements text[] DEFAULT ARRAY[]::text[],
    responsibilities text[] DEFAULT ARRAY[]::text[],
    "salaryMax" double precision,
    "salaryMin" double precision,
    "salaryVisible" boolean DEFAULT false NOT NULL,
    status public."JobStatus" DEFAULT 'DRAFT'::public."JobStatus" NOT NULL,
    summary text,
    "workMode" public."WorkMode" DEFAULT 'HYBRID'::public."WorkMode" NOT NULL
);


ALTER TABLE public."Job" OWNER TO "user";

--
-- Name: Location; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."Location" (
    id text NOT NULL,
    name text NOT NULL,
    "isRemote" boolean DEFAULT false NOT NULL,
    "companyId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Location" OWNER TO "user";

--
-- Name: Media; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."Media" (
    id text NOT NULL,
    "companyId" text NOT NULL,
    url text NOT NULL,
    type text DEFAULT 'image'::text NOT NULL,
    "altText" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Media" OWNER TO "user";

--
-- Name: PageSection; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."PageSection" (
    id text NOT NULL,
    "careersPageId" text NOT NULL,
    "companyId" text NOT NULL,
    type public."SectionType" NOT NULL,
    title text,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    "orderIndex" integer DEFAULT 0 NOT NULL,
    "isDraft" boolean DEFAULT true NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "layoutVariant" text DEFAULT '01'::text NOT NULL,
    enabled boolean DEFAULT true NOT NULL
);


ALTER TABLE public."PageSection" OWNER TO "user";

--
-- Name: User; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    "passwordHash" text NOT NULL,
    role public."Role" DEFAULT 'RECRUITER'::public."Role" NOT NULL,
    "companyId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO "user";

--
-- Data for Name: Application; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Application" (id, "jobId", "companyId", "candidateName", "candidateEmail", "resumeUrl", "coverLetter", status, "createdAt", "updatedAt") FROM stdin;
cmtoise7w0009nqd7nndikyeh	cmtoise780005nqd70xgpg7wb	cmtoise6g0000nqd76184rut3	Alex Rivera	alex.rivera@example.com	https://example.com/resumes/alex-rivera.pdf	I am thrilled to apply for the Senior Full Stack Engineer role at Acme Corp. With 6 years building Next.js apps, I am confident in adding immediate value to your engineering team.	PENDING	2026-09-05 15:10:43.964	2026-09-05 15:10:43.964
cmtok9hg70000vqd74y0z0zhg	cmtoise780005nqd70xgpg7wb	cmtoise6g0000nqd76184rut3	qw5yq	chithulurinaveen@gmail.com	htpps://wrgr	53y3	PENDING	2026-09-05 15:52:00.92	2026-09-05 15:52:00.92
cmton53gr000mvqd7xc910js4	cmtoise7k0007nqd76nriy6zk	cmtoise6g0000nqd76184rut3	Aasc	ascA@AWDEFW.WFW	https://wefwf.wdfw	\N	PENDING	2026-09-05 17:12:35.019	2026-09-05 17:12:35.019
\.


--
-- Data for Name: CareersPage; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."CareersPage" (id, "companyId", "metaTitle", "metaDescription", "isPublished", "publishedAt", "createdAt", "updatedAt") FROM stdin;
cmtop3u0q000xvqd74qklar35	cmtop3u0j000vvqd7fgj5b20w	\N	\N	t	2026-09-05 18:07:35.352	2026-09-05 18:07:35.354	2026-09-05 18:07:35.354
cmtoise86000cnqd7pgr8cwq3	cmtoise80000anqd7c88xiexp	Careers at TechNova AI | Build the Future of AI Healthcare	Join TechNova AI research labs. We are hiring machine learning researchers, bioinformaticians, and full-stack software engineers.	t	2026-09-06 03:06:51.372	2026-09-05 15:10:43.974	2026-09-06 03:06:51.4
cmtoise6v0002nqd7r9fnzc0f	cmtoise6g0000nqd76184rut3	Careers at Acme Corp | Join Our World-Class Team	Explore open engineering, product, and growth roles at Acme Corp. Help us build next-generation enterprise software.	t	2026-09-06 03:27:39.191	2026-09-05 15:10:43.927	2026-09-06 03:27:39.198
cmtpen7ja0002b3d75kp4j3tx	cmtpen7j10000b3d7rp89ulxp	\N	\N	t	2026-09-06 06:02:29.732	2026-09-06 06:02:29.734	2026-09-06 06:02:29.734
cmtpf9ekn0002hmd74rcrnuu3	cmtpf9ekh0000hmd7flbz227v	\N	\N	t	2026-09-06 06:19:45.286	2026-09-06 06:19:45.287	2026-09-06 06:19:45.287
\.


--
-- Data for Name: Company; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."Company" (id, name, slug, "logoUrl", "bannerUrl", "primaryColor", "secondaryColor", "fontFamily", tagline, "aboutText", "createdAt", "updatedAt", "cornerRadius", "sectionSpacing", "companySize", "cultureVideoUrl", description, industry, location, website) FROM stdin;
cmtoise80000anqd7c88xiexp	TechNova AI	technova	/uploads/1788663989517-Screenshot_from_2026-09-06_08-36-24.png	https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80	#a855f7	midnight-purple	Outfit	Pioneering Generative AI for Precision Healthcare	TechNova combines modern deep learning foundation models with biomedical data to accelerate life-saving drug discovery.	2026-09-05 15:10:43.968	2026-09-06 05:12:39.003	12	3.5rem	\N	\N	\N	\N	\N	\N
cmtop3u0j000vvqd7fgj5b20w	Kokkula Private Limited	kokkula-private-limited	/uploads/1788631737121-Screenshot_from_2026-09-05_23-38-48.png	/uploads/1788631741878-Screenshot_from_2026-09-05_22-11-09.png	#0f766e	corporate-clean	Inter	\N	\N	2026-09-05 18:07:35.347	2026-09-05 18:10:02.444	12	3.5rem	\N	\N	\N	\N	\N	\N
cmtpen7j10000b3d7rp89ulxp	Chittuluri	chittuluri	\N	\N	#0f766e	corporate-clean	Inter	Building Trust. Creating Value. Growing Together	Our culture begins with people. We believe great organizations are built by individuals who feel trusted, respected, and empowered to do their best work.\n\nWe encourage open communication, mutual respect, and an environment where everyone has the opportunity to share ideas and take ownership of their work.	2026-09-06 06:02:29.725	2026-09-06 06:07:11.531	12	3.5rem	\N	\N	\N	\N	Mittapalli	\N
cmtoise6g0000nqd76184rut3	Acme Corp	acme-corp	/uploads/1788664706321-Screenshot_from_2026-09-06_08-36-24.png	/uploads/1788633160105-Screenshot_from_2026-09-05_23-38-48.png	#a855f7	midnight-purple	Outfit	Building the future of enterprise cloud automation.	Acme Corp empowers thousands of global businesses to automate complex workflows with speed, security, and elegance.	2026-09-05 15:10:43.913	2026-09-06 04:57:12.494	19	2rem	\N	\N	\N	\N	\N	\N
cmtpf9ekh0000hmd7flbz227v	Santhu-enterprises	santhu-enterprises	\N	\N	#06b6d4	cyber-dark	Inter	\N	\N	2026-09-06 06:19:45.281	2026-09-06 06:50:24.225	12	3.5rem	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: Department; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."Department" (id, name, "companyId", "createdAt") FROM stdin;
cmtpen7ji0005b3d7oy7msloi	Engineering	cmtpen7j10000b3d7rp89ulxp	2026-09-06 06:02:29.742
cmtpen7jo0006b3d7pf6piyb6	Product & Design	cmtpen7j10000b3d7rp89ulxp	2026-09-06 06:02:29.748
cmtpen7jo0007b3d7g333oc8k	Sales & Marketing	cmtpen7j10000b3d7rp89ulxp	2026-09-06 06:02:29.748
cmtpen7jo0008b3d77grfs2q8	Operations	cmtpen7j10000b3d7rp89ulxp	2026-09-06 06:02:29.748
cmtpf9eku0005hmd74m7iz662	Engineering	cmtpf9ekh0000hmd7flbz227v	2026-09-06 06:19:45.294
cmtpf9eky0006hmd708180uvc	Product & Design	cmtpf9ekh0000hmd7flbz227v	2026-09-06 06:19:45.298
cmtpf9eky0007hmd7f901eigo	Sales & Marketing	cmtpf9ekh0000hmd7flbz227v	2026-09-06 06:19:45.298
cmtpf9eky0008hmd79bnvnkha	Operations	cmtpf9ekh0000hmd7flbz227v	2026-09-06 06:19:45.298
\.


--
-- Data for Name: Job; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."Job" (id, title, slug, description, "jobType", "isPublished", "companyId", "departmentId", "locationId", "createdAt", "updatedAt", benefits, currency, "datePosted", "departmentName", "employmentType", "expiryDate", "locationCity", "locationCountry", "preferredSkills", requirements, responsibilities, "salaryMax", "salaryMin", "salaryVisible", status, summary, "workMode") FROM stdin;
cmtopfq2p0013vqd7e7jhmcjf	IT Support	it-support-6265	\N	FULL_TIME	t	cmtop3u0j000vvqd7fgj5b20w	\N	\N	2026-09-05 18:16:50.113	2026-09-05 18:16:50.113	{"daily tea"}	INR	2026-09-05 18:16:50.112	Engineering	FULL_TIME	2026-09-11 00:00:00	kamareddy	INDIA	{communication}	{"4+ yesr"}	{"Saree foldings"}	1500	1000	t	ACTIVE	Manchi cheeralu ammali	HYBRID
cmtpa1xsq00010wd7oqzit5yx	Full Stack Developer	full-stack-developer-4701	\N	FULL_TIME	t	cmtoise6g0000nqd76184rut3	\N	\N	2026-09-06 03:53:58.874	2026-09-06 03:53:58.874	{"Health & Wellness","Financial & Future Planning","Work-Life Balance & Flexibility","Professional Growth & Learning"}	INR	2026-09-06 03:53:58.871	Engineering	FULL_TIME	2026-09-18 00:00:00	Hyderabad	India	{"Cloud & DevOps:","CI/CD Pipelines","System Architecture","Caching & Performance"}	{"Technical Stack Proficiency: Working knowledge of front-end and back-end languages, plus database systems.","Tools Knowledge: Familiarity with RESTful APIs, Git/GitHub, command-line interfaces, and package managers (npm, pip).","Education: A degree in computer science, software engineering, or equivalent practical coding experience.","Soft Skills: Strong problem-solving abilities, attention to detail, and clear communication for teamwork"}	{"End-to-End Development: Design, build, and maintain functional web applications from conception to deployment.","Front-End Creation: Build user interfaces with HTML, CSS, and modern JavaScript frameworks (like React, Angular, or Vue.js).","Back-End Logic: Develop server-side logic, APIs, and architecture using languages such as Node.js, Python, Java, Ruby, or PHP.","Database Management: Create, manage, and optimize SQL or NoSQL databases (like MySQL, PostgreSQL, or MongoDB) for efficient storage."}	16000000	1200000	t	ACTIVE	A full-stack developer builds and manages both the front-end (client-side) and back-end (server-side) of web applications and digital systems.	HYBRID
cmtoise7q0008nqd7ful3cnzu	Director of Enterprise Sales (Draft Requisition)	director-of-enterprise-sales	\N	FULL_TIME	t	cmtoise6g0000nqd76184rut3	\N	\N	2026-09-05 15:10:43.958	2026-09-05 17:36:23.412	{"Commission bonus structure"}	USD	2026-09-05 17:36:19.776	Sales & Business Development	FULL_TIME	\N	San Francisco	United States	{"Salesforce CRM"}	{"10+ years B2B enterprise SaaS sales track record."}	{"Build enterprise sales playbook."}	280000	200000	t	ACTIVE	Lead Fortune 500 account executive strategy and expand ARR across North America.	ON_SITE
cmtoise780005nqd70xgpg7wb	Senior Full Stack Engineer (Next.js & Node.js)	senior-full-stack-engineer	\N	FULL_TIME	t	cmtoise6g0000nqd76184rut3	\N	\N	2026-09-05 15:10:43.94	2026-09-05 15:10:43.94	{"100% remote flexibility with home office stipend","Top-tier health, dental, and vision insurance for candidate and family","$3,000 annual learning and development budget","Unlimited PTO with mandatory 25 days minimum vacation"}	USD	2026-09-05 15:10:43.938	Engineering	FULL_TIME	2026-12-04 15:10:43.938	San Francisco	United States	{"Docker & Kubernetes containerization","AWS Cloud infrastructure","Tailwind CSS & Radix UI"}	{"5+ years of software engineering experience in production JavaScript/TypeScript environments.","Deep expertise with React, Next.js, and server-side rendering architecture.","Hands-on experience with PostgreSQL, Prisma ORM, and Redis caching.","Strong understanding of web performance optimization and accessibility standards."}	{"Architect and implement high-performance web applications using Next.js App Router & TypeScript.","Collaborate with Product and Design teams to build intuitive, accessible component systems.","Optimize distributed GraphQL and REST endpoints for sub-100ms response latency.","Conduct rigorous code reviews and mentor junior engineering team members."}	180000	140000	t	ACTIVE	Lead front-end architecture and backend microservices using Next.js, React, TypeScript, and Node.js for cloud automation.	HYBRID
cmtoise7f0006nqd7n92tx68e	Principal Cloud Systems Architect	principal-cloud-systems-architect	\N	FULL_TIME	t	cmtoise6g0000nqd76184rut3	\N	\N	2026-09-05 15:10:43.947	2026-09-05 15:10:43.947	{"Competitive equity packages","Full medical coverage","Annual international team retreats"}	USD	2026-09-05 15:10:43.945	Infrastructure	FULL_TIME	2026-11-04 15:10:43.945	New York	United States	{"Go & Rust scripting","eBPF monitoring & Datadog APM","Vault secret management"}	{"7+ years of DevOps / Site Reliability Engineering experience at enterprise scale.","Expert knowledge of Terraform, Kubernetes, Helm, and Istio service mesh.","Proven track record managing multi-cloud infra handling >99.99% uptime SLAs."}	{"Design cloud-native architecture across multi-region AWS and GCP deployments.","Manage CI/CD pipelines, automated testing suites, and blue-green zero-downtime deployment workflows.","Ensure enterprise SOC-2 compliance, zero-trust network boundaries, and automated threat mitigation."}	230000	180000	t	ACTIVE	Architect high-availability Kubernetes clusters and Terraform infrastructure supporting millions of concurrent RPC requests.	REMOTE
cmtoise7k0007nqd76nriy6zk	Lead Product Designer (UI/UX Systems)	lead-product-designer	\N	FULL_TIME	t	cmtoise6g0000nqd76184rut3	\N	\N	2026-09-05 15:10:43.952	2026-09-05 15:10:43.952	{"Flex hybrid schedule","Pension match scheme","Wellness allowance"}	GBP	2026-09-05 15:10:43.95	Product & Design	FULL_TIME	\N	London	United Kingdom	{"HTML/CSS understanding","Micro-animation design with Framer"}	{"4+ years designing B2B SaaS desktop software interfaces.","Strong portfolio showcasing system design thinking and responsive web design.","Expert proficiency in Figma, prototyping tools, and user research methodologies."}	{"Design pixel-perfect user interfaces, user flows, and wireframes for complex cloud workflows.","Conduct candidate and customer usability interviews to iterate on product usability.","Maintain comprehensive Figma design tokens synced with frontend Tailwind themes."}	120000	90000	f	ACTIVE	Define the visual design language, interaction design systems, and Figma component libraries for developer portals.	HYBRID
cmtoise8f000fnqd7504a8bg6	Senior AI / ML Research Scientist (Genomics)	senior-ml-research-scientist	\N	FULL_TIME	t	cmtoise80000anqd7c88xiexp	\N	\N	2026-09-05 15:10:43.983	2026-09-05 15:10:43.983	{"Competitive startup equity with high growth trajectory","Full health and dental coverage","Generous conference travel stipends"}	USD	2026-09-05 15:10:43.982	AI Research Labs	FULL_TIME	\N	Boston	United States	{"BioNeMo framework","AlphaFold 2/3 molecular modeling","CUDA kernel programming"}	{"Ph.D. in Computer Science, Machine Learning, Computational Biology, or related quantitative field.","Proven publication record in top-tier AI Conferences.","Expertise in PyTorch, Distributed Data Parallel (DDP), and GPU cluster optimization."}	{"Train large language and diffusion models on multi-terabyte genomic sequencing data.","Publish high-impact research papers at NeurIPS, ICML, and Nature Biotechnology.","Bridge experimental biology with algorithmic deep learning architectures."}	220000	160000	t	ACTIVE	Research and deploy transformer-based foundation models trained on high-throughput genomic and proteomic datasets.	HYBRID
cmtoise8l000gnqd7uil909m1	Backend Infrastructure Engineer (PyTorch & Rust)	backend-infrastructure-engineer	\N	FULL_TIME	t	cmtoise80000anqd7c88xiexp	\N	\N	2026-09-05 15:10:43.989	2026-09-05 15:10:43.989	{"Remote work flexibility","Wellness reimbursement","Learning budget"}	USD	2026-09-05 15:10:43.988	Software Engineering	FULL_TIME	\N	Remote	Worldwide	{"Apache Arrow","Parquet file format","Ray distributed execution"}	{"3+ years experience with Rust or C++ in production backend infrastructure.","Familiarity with Linux kernel I/O and GPU IPC."}	{"Build streaming data loaders handling terabytes of genomic variant files.","Develop high-speed Rust bindings for PyTorch tensor manipulation."}	170000	130000	t	ACTIVE	Scale model training pipelines across multi-node GPU clusters, optimizing distributed memory layout and data ingestion.	REMOTE
\.


--
-- Data for Name: Location; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."Location" (id, name, "isRemote", "companyId", "createdAt") FROM stdin;
cmtpen7jd0003b3d7fcn0vb23	Mittapalli	f	cmtpen7j10000b3d7rp89ulxp	2026-09-06 06:02:29.737
cmtpen7jg0004b3d70l5cy89t	Remote	t	cmtpen7j10000b3d7rp89ulxp	2026-09-06 06:02:29.74
cmtpf9ekq0003hmd7v26ljpfb	Khammam	f	cmtpf9ekh0000hmd7flbz227v	2026-09-06 06:19:45.29
cmtpf9eks0004hmd778q69wc8	Remote	t	cmtpf9ekh0000hmd7flbz227v	2026-09-06 06:19:45.292
\.


--
-- Data for Name: Media; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."Media" (id, "companyId", url, type, "altText", "createdAt") FROM stdin;
cmtolwieg0009vqd7g0qzf3tr	cmtoise6g0000nqd76184rut3	/uploads/1788626274855-carrot.webp	image	carrot.webp	2026-09-05 16:37:54.856
cmtom0fbp000cvqd763zr03kl	cmtoise6g0000nqd76184rut3	/uploads/1788626457491-youthville_to_pune.jpeg	image		2026-09-05 16:40:57.493
cmtom0zn2000dvqd72agndk5v	cmtoise6g0000nqd76184rut3	/uploads/1788626483821-Screenshot_from_2026-09-05_22-11-09.png	image		2026-09-05 16:41:23.822
cmtomdjph000ivqd7moc51cgu	cmtoise6g0000nqd76184rut3	/uploads/1788627069700-carrot.webp	image	carrot.webp	2026-09-05 16:51:09.701
cmtomzfvd000kvqd7x8fd6uan	cmtoise6g0000nqd76184rut3	/uploads/1788628091157-carrot.webp	image	carrot.webp	2026-09-05 17:08:11.161
cmtomzn1r000lvqd7btff2nzc	cmtoise6g0000nqd76184rut3	/uploads/1788628100461-Screenshot_from_2026-09-05_22-11-09.png	image	Screenshot from 2026-09-05 22-11-09.png	2026-09-05 17:08:20.463
cmtop5l440010vqd7nt0lqmqr	cmtop3u0j000vvqd7fgj5b20w	/uploads/1788631737121-Screenshot_from_2026-09-05_23-38-48.png	image		2026-09-05 18:08:57.124
cmtop5os70011vqd76ni57lfy	cmtop3u0j000vvqd7fgj5b20w	/uploads/1788631741878-Screenshot_from_2026-09-05_22-11-09.png	image		2026-09-05 18:09:01.879
cmtoq033f0001y0d7jluiml8p	cmtoise6g0000nqd76184rut3	/uploads/1788633160105-Screenshot_from_2026-09-05_23-38-48.png	image	Screenshot from 2026-09-05 23-38-48.png	2026-09-05 18:32:40.108
cmtp8cv8100001xd7rrd8ywao	cmtoise80000anqd7c88xiexp	/uploads/1788663989517-Screenshot_from_2026-09-06_08-36-24.png	image		2026-09-06 03:06:29.521
cmtp8s8b800021xd7ftf746zb	cmtoise6g0000nqd76184rut3	/uploads/1788664706321-Screenshot_from_2026-09-06_08-36-24.png	image	Screenshot from 2026-09-06 08-36-24.png	2026-09-06 03:18:26.324
\.


--
-- Data for Name: PageSection; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."PageSection" (id, "careersPageId", "companyId", type, title, content, "orderIndex", "isDraft", "isPublished", "createdAt", "updatedAt", "layoutVariant", enabled) FROM stdin;
cmtoise710004nqd7pyskcup6	cmtoise6v0002nqd7r9fnzc0f	cmtoise6g0000nqd76184rut3	OPEN_ROLES	Open Requisitions	{"layout": {"paddingY": "md", "alignment": "left", "container": "wide"}, "elements": [{"id": "j-head-1", "type": "heading", "styles": {"typography": {"fontSize": "41px", "textAlign": "center", "fontWeight": "300"}}, "content": {"text": "Open Careers at @company_name", "level": 2}, "enabled": true, "position": 0, "alignment": "left"}, {"id": "j-text-1", "type": "text", "styles": {"typography": {"textAlign": "center"}}, "content": {"text": "Explore @active_jobs_count positions currently open across Engineering, Product, and Sales."}, "enabled": true, "position": 1, "alignment": "left"}], "showInNav": true, "templateId": "jobs-grid-cards"}	4	t	t	2026-09-05 15:10:43.933	2026-09-06 04:02:23.687	01	t
cmtpen7k4000db3d7a0e3mtss	cmtpen7ja0002b3d75kp4j3tx	cmtpen7j10000b3d7rp89ulxp	PERKS_BENEFITS	Benefits Cards Grid	{"layout": {"paddingY": "md", "alignment": "center", "container": "wide"}, "elements": [{"id": "ben-heading", "type": "heading", "content": {"text": "Perks & Total Rewards", "level": 2}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "ben-text", "type": "text", "content": {"text": "We invest in your long-term success, health, and personal growth."}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "ben-list", "type": "list", "content": {"items": [{"id": "b1", "title": "100% Remote Flexibility", "description": "Work from anywhere with home office stipends."}, {"id": "b2", "title": "Top-Tier Health & Dental", "description": "Comprehensive coverage for you and your family."}, {"id": "b3", "title": "Competitive Equity Options", "description": "Direct ownership in company growth."}, {"id": "b4", "title": "$3,000 L&D Budget", "description": "Annual allowance for courses, books, & conferences."}, {"id": "b5", "title": "Unlimited PTO & Wellness Days", "description": "Minimum 25 mandatory vacation days guaranteed."}, {"id": "b6", "title": "Parental Leave Package", "description": "16 weeks fully paid parental leave for primary caregivers."}]}, "enabled": true, "position": 2}], "showInNav": true, "templateId": "benefits-grid-cards"}	3	t	t	2026-09-06 06:02:29.764	2026-09-06 06:05:02.076	01	t
cmtpen7k4000cb3d7sahoxgw7	cmtpen7ja0002b3d75kp4j3tx	cmtpen7j10000b3d7rp89ulxp	CULTURE_VIDEO	Culture Video Spotlight	{"layout": {"paddingY": "md", "alignment": "center", "container": "wide"}, "elements": [{"id": "cv-heading", "type": "heading", "content": {"text": "Life Inside Chittuluri", "level": 2}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "cv-text", "type": "text", "content": {"text": "Watch team members discuss product vision, engineering hackathons, and our work culture."}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "cv-video", "type": "video", "width": "full", "content": {"videoUrl": "@culture_video", "posterUrl": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"}, "enabled": true, "position": 2}], "showInNav": true, "templateId": "culture-video-embed"}	2	t	t	2026-09-06 06:02:29.764	2026-09-06 06:05:13.572	01	t
cmtpen7k4000bb3d7ygcicshd	cmtpen7ja0002b3d75kp4j3tx	cmtpen7j10000b3d7rp89ulxp	ABOUT_US	About Us - Centered Story	{"layout": {"paddingY": "md", "alignment": "center", "container": "narrow"}, "elements": [{"id": "about-cnt-heading", "type": "heading", "content": {"text": "Driven by Purpose, Built for Impact", "level": 2}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "about-cnt-text", "type": "text", "content": {"text": "Our culture begins with people. We believe great organizations are built by individuals who feel trusted, respected, and empowered to do their best work.\\n\\nWe encourage open communication, mutual respect, and an environment where everyone has the opportunity to share ideas and take ownership of their work."}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "about-cnt-stats", "type": "stats", "content": {"items": [{"id": "s1", "title": "Global Team", "value": "350+"}, {"id": "s2", "title": "Glassdoor Rating", "value": "4.9 ★"}, {"id": "s3", "title": "Retention Rate", "value": "96%"}]}, "enabled": true, "position": 2, "alignment": "center"}], "showInNav": true, "templateId": "about-centered"}	1	t	t	2026-09-06 06:02:29.764	2026-09-06 06:05:27.536	01	t
cmtolu70l0008vqd766zio45n	cmtoise6v0002nqd7r9fnzc0f	cmtoise6g0000nqd76184rut3	ABOUT_US	About Us - Image Right	{"layout": {"paddingY": "md", "alignment": "left", "container": "wide"}, "elements": [{"id": "about-img-right-heading", "type": "heading", "width": "half", "content": {"text": "Our Origins & Global Growth", "level": 2}, "enabled": true, "position": 0}, {"id": "about-img-right-text", "type": "text", "width": "half", "content": {"text": "From a garage setup to 300+ teammates across 18 countries, our culture prioritizes async workflows, deep focus time, and high compensation standards."}, "enabled": true, "position": 1}, {"id": "about-img-right-img", "type": "image", "width": "full", "content": {"alt": "Global Office Headquarters", "fit": "cover", "url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80"}, "enabled": true, "position": 2}], "showInNav": false, "cardStyles": {"shadow": "none", "background": "transparent", "borderWidth": 0, "borderRadius": 0}, "templateId": "about-image-right"}	1	t	t	2026-09-05 16:36:06.789	2026-09-06 04:02:23.682	01	t
cmtooqa74000pvqd7vr8oyjmw	cmtoise6v0002nqd7r9fnzc0f	cmtoise6g0000nqd76184rut3	CUSTOM_TEXT	Recruitment FAQ & Q&A Accordion	{"layout": {"paddingY": "lg", "alignment": "left", "container": "narrow"}, "elements": [{"id": "faq-heading", "type": "heading", "content": {"text": "Frequently Asked Recruitment Questions", "level": 2}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "faq-text", "type": "text", "width": "half", "content": {"text": "Find answers about our hiring timeline, technical interview process, and remote work policies "}, "enabled": true, "position": 2, "alignment": "center"}, {"id": "faq-list", "type": "list", "content": {"items": [{"id": "f1", "title": "What does the interview process look like?", "description": "1. Initial recruiter screening call. 2. Hiring manager interview. 3. Practical portfolio/technical assessment. 4. Final team alignment."}, {"id": "f2", "title": "Are positions fully remote or hybrid?", "description": "We offer full remote flexibility in supported countries as well as hybrid work options at our main headquarters."}, {"id": "f3", "title": "What learning and development perks are offered?", "description": "Every full-time team member receives an annual stipend for conferences, books, and online learning courses."}]}, "enabled": true, "position": 3}], "showInNav": false, "templateId": "custom-rich-faq"}	7	t	t	2026-09-05 17:57:03.136	2026-09-06 04:02:26.855	01	t
cmtoise8b000enqd7keaxcser	cmtoise86000cnqd7pgr8cwq3	cmtoise80000anqd7c88xiexp	OPEN_ROLES	Open Positions	{"layout": {"paddingY": "md", "alignment": "left", "container": "wide"}, "elements": [{"id": "tn-j-head", "type": "heading", "width": "full", "content": {"text": "Open Careers at @company_name ", "level": 2}, "enabled": true, "position": 0, "alignment": "left"}, {"id": "tn-j-text", "type": "text", "content": {"text": "Explore our @active_jobs_count open positions in AI Research, BioInformatics, and Software Engineering."}, "enabled": true, "position": 1, "alignment": "left"}], "showInNav": false, "templateId": "jobs-grid-cards"}	2	t	t	2026-09-05 15:10:43.979	2026-09-06 04:59:51.062	01	t
cmtpen7k4000eb3d7lj5gg8wi	cmtpen7ja0002b3d75kp4j3tx	cmtpen7j10000b3d7rp89ulxp	OPEN_ROLES	Open Positions Grid	{"layout": {"paddingY": "md", "alignment": "left", "container": "wide"}, "elements": [{"id": "jobs-heading", "type": "heading", "content": {"text": "Current Open Positions", "level": 2}, "enabled": true, "position": 0, "alignment": "left"}, {"id": "jobs-text", "type": "text", "content": {"text": "Find your next career step across Engineering, Product, and Operations."}, "enabled": true, "position": 1, "alignment": "left"}], "showInNav": true, "templateId": "jobs-grid-cards"}	4	t	t	2026-09-06 06:02:29.764	2026-09-06 06:14:31.741	01	t
cmtpen7k4000fb3d75596cea3	cmtpen7ja0002b3d75kp4j3tx	cmtpen7j10000b3d7rp89ulxp	CTA	Call To Action Banner	{"layout": {"paddingY": "lg", "alignment": "center", "container": "narrow"}, "elements": [{"id": "cta-heading", "type": "heading", "content": {"text": "Ready to Build the Future with Chittuluri?", "level": 2}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "cta-text", "type": "text", "content": {"text": "Explore open requisitions or connect with our recruitment team directly."}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "cta-button", "type": "button", "content": {"url": "#open-positions", "text": "View Open Positions", "label": "View Open Positions", "linkUrl": "#open-positions", "variant": "primary"}, "enabled": true, "position": 2, "alignment": "center"}], "showInNav": false, "templateId": "cta-banner-centered"}	5	t	t	2026-09-06 06:02:29.764	2026-09-06 06:18:09.073	01	t
cmtop3u10000zvqd7zj2lpic0	cmtop3u0q000xvqd74qklar35	cmtop3u0j000vvqd7fgj5b20w	OPEN_ROLES	Current Openings	{"elements": [{"id": "h2", "type": "heading", "content": {"text": "Open Requisitions"}, "alignment": "center"}], "showInNav": true, "templateId": "jobs-grid-cards"}	1	f	t	2026-09-05 18:07:35.364	2026-09-05 18:07:35.364	01	t
cmtop3u10000yvqd7gh418dy5	cmtop3u0q000xvqd74qklar35	cmtop3u0j000vvqd7fgj5b20w	HERO	Join Kokkula Private Limited	{"elements": [{"id": "h1", "type": "heading", "content": {"text": "Build Your Career at Kokkula Private Limited"}, "alignment": "left"}, {"id": "t1", "type": "text", "content": {"text": "We are on a mission to build extraordinary products with an ambitious team."}, "alignment": "left"}, {"id": "b1", "type": "button", "content": {"url": "#jobs-section", "text": "Explore Open Roles"}, "alignment": "left"}], "showInNav": true, "cardStyles": {"background": "solid-white"}, "templateId": "hero-split"}	0	t	t	2026-09-05 18:07:35.364	2026-09-05 18:17:59.335	01	t
cmtom8pyt000fvqd7ayfmbxiw	cmtoise6v0002nqd7r9fnzc0f	cmtoise6g0000nqd76184rut3	CTA	Call To Action Banner	{"layout": {"paddingY": "lg", "alignment": "center", "container": "narrow"}, "elements": [{"id": "cta-heading", "type": "heading", "content": {"text": "Ready to Build Next-Generation Cloud Tools?", "level": 2}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "cta-text", "type": "text", "content": {"text": "Don't see an exact role? Submit an open application and let's start a conversation."}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "cta-button", "type": "button", "content": {"label": "Apply Now or Send Resume", "linkUrl": "#open-positions", "variant": "primary"}, "enabled": true, "position": 2, "alignment": "left"}], "showInNav": false, "templateId": "cta-banner-centered"}	5	t	t	2026-09-05 16:47:24.533	2026-09-06 04:02:23.688	01	t
cmtpceelx00020wd775i2jm2f	cmtoise86000cnqd7pgr8cwq3	cmtoise80000anqd7c88xiexp	ABOUT_US	About Us - Image Left	{"layout": {"paddingY": "md", "alignment": "left", "container": "wide"}, "elements": [{"id": "about-img-left-img", "type": "image", "width": "full", "content": {"alt": "Team workshop session", "fit": "cover", "url": "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"}, "enabled": true, "position": 0}, {"id": "about-img-left-heading", "type": "heading", "width": "half", "content": {"text": "Driven by Purpose, Built for Impact", "level": 2}, "enabled": true, "position": 1}, {"id": "about-img-left-text", "type": "text", "width": "half", "content": {"text": "Founded in 2021, our mission is to redefine how cloud software is developed and deployed. We foster an environment of radical candor, continuous learning, and shared ownership."}, "enabled": true, "position": 2}], "templateId": "about-image-left"}	1	t	f	2026-09-06 04:59:39.765	2026-09-06 05:00:42.84	01	t
cmtpen7k4000ab3d766x1xhzb	cmtpen7ja0002b3d75kp4j3tx	cmtpen7j10000b3d7rp89ulxp	HERO	Hero Centered	{"layout": {"paddingY": "lg", "alignment": "center", "container": "narrow"}, "elements": [{"id": "hero-badge-1", "type": "badge", "content": {"text": "We Are Hiring at @company_name · @active_jobs_count Open Roles"}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "hero-heading-1", "type": "heading", "content": {"text": "Building Trust. Creating Value. Growing Together", "level": 1}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "hero-text-1", "type": "text", "content": {"text": "Chittuluri Enterprises is a growth-focused organization built around a simple belief: lasting success comes from combining strong values, talented people, and a commitment to continuous improvement. "}, "enabled": true, "position": 2, "alignment": "center"}, {"id": "hero-button-1", "type": "button", "content": {"url": "#open-positions", "text": "Explore Open Roles", "label": "Explore Open Roles", "linkUrl": "#open-positions", "variant": "primary"}, "enabled": true, "position": 3, "alignment": "center"}], "showInNav": true, "templateId": "hero-centered"}	0	t	t	2026-09-06 06:02:29.764	2026-09-06 06:07:23.411	01	t
cmtp9n5tq00000wd759yj02wv	cmtoise6v0002nqd7r9fnzc0f	cmtoise6g0000nqd76184rut3	CULTURE_VIDEO	Culture Video Spotlight (Copy)	{"layout": {"paddingY": "md", "alignment": "center", "container": "wide"}, "elements": [{"id": "cv-heading", "type": "heading", "content": {"text": "Life Inside Our Engineering Hub", "level": 2}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "cv-text", "type": "text", "content": {"text": "Watch team members discuss product vision, hackathons, and our work culture."}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "cv-video", "type": "video", "width": "full", "content": {"videoUrl": "https://youtu.be/FlOzIM7Yov4?si=fWffMjMBvhQcZiV9", "posterUrl": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"}, "enabled": true, "position": 2}], "showInNav": false, "templateId": "culture-video-embed"}	9	t	f	2026-09-06 03:42:29.438	2026-09-06 04:05:25.145	01	t
cmtpf9el2000bhmd76npv3gse	cmtpf9ekn0002hmd74rcrnuu3	cmtpf9ekh0000hmd7flbz227v	CULTURE_VIDEO	Culture Video Spotlight	{"layout": {"paddingY": "md", "alignment": "center", "container": "wide"}, "elements": [{"id": "cv-heading", "type": "heading", "content": {"text": "Life Inside Our Engineering Hub", "level": 2}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "cv-text", "type": "text", "content": {"text": "Watch team members discuss product vision, hackathons, and our work culture."}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "cv-video", "type": "video", "width": "full", "content": {"videoUrl": "@culture_video", "posterUrl": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"}, "enabled": true, "position": 2}], "showInNav": true, "templateId": "culture-video-embed"}	2	f	t	2026-09-06 06:19:45.302	2026-09-06 06:19:45.302	01	t
cmtpf9el2000chmd74oymn1pn	cmtpf9ekn0002hmd74rcrnuu3	cmtpf9ekh0000hmd7flbz227v	PERKS_BENEFITS	Benefits Cards Grid	{"layout": {"paddingY": "md", "alignment": "center", "container": "wide"}, "elements": [{"id": "ben-heading", "type": "heading", "content": {"text": "Perks & Total Rewards", "level": 2}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "ben-text", "type": "text", "content": {"text": "We invest in your long-term success, health, and personal growth."}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "ben-list", "type": "list", "styles": {"colors": {"color": "#948489", "backgroundColor": "#1f1e20"}}, "content": {"items": [{"id": "b1", "title": "100% Remote Flexibility", "description": "Work from anywhere with home office stipends."}, {"id": "b2", "title": "Top-Tier Health & Dental", "description": "Comprehensive coverage for you and your family."}, {"id": "b3", "title": "Competitive Equity Options", "description": "Direct ownership in company growth."}, {"id": "b4", "title": "$3,000 L&D Budget", "description": "Annual allowance for courses, books, & conferences."}, {"id": "b5", "title": "Unlimited PTO & Wellness Days", "description": "Minimum 25 mandatory vacation days guaranteed."}, {"id": "b6", "title": "Parental Leave Package", "description": "16 weeks fully paid parental leave for primary caregivers."}]}, "enabled": true, "position": 2}], "showInNav": true, "templateId": "benefits-grid-cards"}	3	t	t	2026-09-06 06:19:45.302	2026-09-06 07:01:23.289	01	t
cmtol0p3r0001vqd7jo2i7se1	cmtoise6v0002nqd7r9fnzc0f	cmtoise6g0000nqd76184rut3	CULTURE_VIDEO	Culture Video + Narrative	{"layout": {"paddingY": "md", "alignment": "left", "container": "wide"}, "elements": [{"id": "csv-heading", "type": "heading", "width": "half", "content": {"text": "Life Inside Our Engineering Hub", "level": 2}, "enabled": true, "position": 0}, {"id": "csv-text", "type": "text", "width": "half", "content": {"text": "Watch team members discuss product vision, hackathons, and our work culture."}, "enabled": true, "position": 1}, {"id": "csv-video", "type": "video", "width": "half", "content": {"videoUrl": "https://youtu.be/G-sjsTdCJww?si=ZP5oeQD0PTP7ds2d", "posterUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"}, "enabled": true, "position": 2}], "showInNav": false, "templateId": "culture-split-video"}	2	t	t	2026-09-05 16:13:10.552	2026-09-06 04:02:23.684	01	t
cmtoise710003nqd7vfdbk7nf	cmtoise6v0002nqd7r9fnzc0f	cmtoise6g0000nqd76184rut3	HERO	Hero Centered	{"layout": {"paddingY": "lg", "alignment": "center", "container": "narrow"}, "elements": [{"id": "hero-badge-1", "type": "badge", "content": {"text": "We Are Hiring at @company_name · @active_jobs_count Open Roles"}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "hero-heading-1", "type": "heading", "styles": {"border": {"style": "solid", "width": "0px", "radius": "0px"}, "typography": {"fontSize": "28px"}}, "content": {"text": "Build the Future of @company_industry with @company_name @company_tagline @company_tagline @company_location @company_location", "level": 1}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "hero-text-1", "type": "text", "content": {"text": "Join @company_name in @company_location to build scalable systems. @company_tagline"}, "enabled": true, "position": 2, "alignment": "center"}, {"id": "hero-button-1", "type": "button", "styles": {}, "content": {"label": "Explore Open Opportunities", "linkUrl": "#apply", "variant": "primary"}, "enabled": true, "position": 3, "alignment": "center"}, {"id": "stats-1788665469495-qb82t", "type": "stats", "content": {"items": [{"id": "s1", "title": "No of Employees", "value": "350+"}, {"id": "s2", "title": "Rating", "value": "4.9 ★"}, {"id": "s3", "title": "Retention Rate", "value": "96%"}]}, "enabled": true, "position": 4, "alignment": "center"}], "showInNav": false, "cardStyles": {"shadow": "none", "background": "transparent", "borderWidth": 0, "borderRadius": 0}, "templateId": "hero-centered"}	0	t	t	2026-09-05 15:10:43.933	2026-09-06 04:02:23.681	01	t
cmtol8vqe0005vqd7c35smvoq	cmtoise6v0002nqd7r9fnzc0f	cmtoise6g0000nqd76184rut3	PERKS_BENEFITS	Benefits Cards Grid	{"layout": {"paddingY": "md", "alignment": "center", "container": "wide"}, "elements": [{"id": "ben-heading", "type": "heading", "styles": {"border": {"style": "solid", "radius": "12px"}}, "content": {"text": "Perks & Total Rewards", "level": 2}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "ben-text", "type": "text", "styles": {"shadow": {"preset": "none"}}, "content": {"text": "We invest in your long-term success, health, and personal growth."}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "ben-list", "type": "list", "styles": {"border": {"style": "solid", "radius": "24px"}, "shadow": {"preset": "xl"}, "typography": {"fontSize": "25", "textAlign": "center", "fontWeight": "500"}}, "content": {"items": [{"id": "b1", "title": "100% Remote Flexibility", "description": "Work from anywhere with home office stipends."}, {"id": "b2", "title": "Top-Tier Health & Dental", "description": "Comprehensive coverage for you and your family."}, {"id": "b3", "title": "Competitive Equity Options", "description": "Direct ownership in company growth."}, {"id": "b4", "title": "$3,000 L&D Budget", "description": "Annual allowance for courses, books, & conferences."}, {"id": "b5", "title": "Unlimited PTO & Wellness Days", "description": "Minimum 25 mandatory vacation days guaranteed."}, {"id": "b6", "title": "Parental Leave Package", "description": "16 weeks fully paid parental leave for primary caregivers."}]}, "enabled": true, "position": 2}], "showInNav": false, "templateId": "benefits-grid-cards"}	3	t	t	2026-09-05 16:19:32.39	2026-09-06 04:02:23.686	01	t
cmtpf9el20009hmd7d60nifst	cmtpf9ekn0002hmd74rcrnuu3	cmtpf9ekh0000hmd7flbz227v	HERO	Hero Centered	{"layout": {"paddingY": "lg", "alignment": "center", "container": "narrow"}, "elements": [{"id": "hero-badge-1", "type": "badge", "content": {"text": "We Are Hiring at @company_name · @active_jobs_count Open Roles"}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "hero-heading-1", "type": "heading", "content": {"text": "Build the Future of @company_industry with @company_name", "level": 1}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "hero-text-1", "type": "text", "content": {"text": "he is a giid biy"}, "enabled": true, "position": 2, "alignment": "center"}, {"id": "hero-button-1", "type": "button", "content": {"label": "Explore Open Positions", "linkUrl": "#open-positions", "variant": "primary"}, "enabled": true, "position": 3, "alignment": "center"}], "showInNav": true, "templateId": "hero-centered"}	0	f	t	2026-09-06 06:19:45.302	2026-09-06 06:24:32.402	01	t
cmtom8y0i000gvqd7qcszm16p	cmtoise6v0002nqd7r9fnzc0f	cmtoise6g0000nqd76184rut3	GALLERY	Image Gallery 3-Column Grid	{"layout": {"paddingY": "md", "alignment": "center", "container": "wide"}, "elements": [{"id": "gal-heading", "type": "heading", "content": {"text": "Behind the Scenes at Our HQ & Retreats", "level": 2}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "gal-gallery", "type": "gallery", "content": {"items": [{"id": "g1", "url": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80", "title": "Annual Team Retreat 2025"}, {"id": "g2", "url": "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80", "title": "Engineering Hackathon"}, {"id": "g3", "url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", "title": "Product Design Workshop"}]}, "enabled": true, "position": 1}, {"id": "text-1788626930054-3yhtm", "type": "text", "width": "full", "content": {"text": "Enter narrative copy or paragraph description here..."}, "enabled": true, "position": 2, "alignment": "left"}], "showInNav": false, "cardStyles": {"shadow": "none", "background": "transparent", "borderWidth": 0, "borderRadius": 0}, "templateId": "gallery-grid-3col"}	6	t	t	2026-09-05 16:47:34.962	2026-09-06 04:02:23.689	01	t
cmtoise8b000dnqd7pqchcu5h	cmtoise86000cnqd7pgr8cwq3	cmtoise80000anqd7c88xiexp	HERO	Hero Full Banner Background	{"layout": {"paddingY": "lg", "alignment": "center", "container": "full"}, "elements": [{"id": "hero-bg-heading", "type": "heading", "content": {"text": "Advance @company_industry at @company_name", "level": 1}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "hero-bg-text", "type": "text", "content": {"text": "@company_tagline"}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "hero-bg-image", "type": "image", "content": {"alt": "Collaborative Engineering Team", "fit": "cover", "url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"}, "enabled": true, "position": 2, "alignment": "center"}, {"id": "hero-bg-button", "type": "button", "content": {"label": "View Open Research & Engineering Positions", "linkUrl": "#open-positions", "variant": "primary"}, "enabled": true, "position": 3, "alignment": "center"}], "showInNav": false, "templateId": "hero-image-bg"}	0	t	t	2026-09-05 15:10:43.979	2026-09-06 05:11:35.864	01	t
cmtpf9el2000ehmd7m960216m	cmtpf9ekn0002hmd74rcrnuu3	cmtpf9ekh0000hmd7flbz227v	CTA	Call To Action Banner	{"layout": {"paddingY": "lg", "alignment": "center", "container": "narrow"}, "elements": [{"id": "cta-heading", "type": "heading", "content": {"text": "Ready to Build Next-Generation Cloud Tools?", "level": 2}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "cta-text", "type": "text", "content": {"text": "Don't see an exact role? Submit an open application and let's start a conversation."}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "cta-button", "type": "button", "content": {"label": "Apply Now or Send Resume", "linkUrl": "#open-positions", "variant": "primary"}, "enabled": true, "position": 2, "alignment": "center"}], "showInNav": false, "templateId": "cta-banner-centered"}	5	f	t	2026-09-06 06:19:45.302	2026-09-06 06:19:45.302	01	t
cmtpf9rpr000fhmd7h2bocu8n	cmtpf9ekn0002hmd74rcrnuu3	cmtpf9ekh0000hmd7flbz227v	HERO	Hero Centered	{"layout": {"paddingY": "lg", "alignment": "center", "container": "narrow"}, "elements": [{"id": "hero-badge-1", "type": "badge", "content": {"text": "We Are Hiring at @company_name · @active_jobs_count Open Roles"}, "enabled": true, "position": 0, "alignment": "center"}, {"id": "hero-heading-1", "type": "heading", "content": {"text": "Build the Future of @company_industry with @company_name", "level": 1}, "enabled": true, "position": 1, "alignment": "center"}, {"id": "hero-text-1", "type": "text", "content": {"text": "Join @company_name in @company_location to build scalable, mission-critical systems. @company_tagline"}, "enabled": true, "position": 2, "alignment": "center"}, {"id": "hero-button-1", "type": "button", "content": {"label": "Explore Open Positions", "linkUrl": "#open-positions", "variant": "primary"}, "enabled": true, "position": 3, "alignment": "center"}], "templateId": "hero-centered"}	6	t	f	2026-09-06 06:20:02.319	2026-09-06 06:20:02.319	01	t
cmtpf9el2000dhmd7f5waqet0	cmtpf9ekn0002hmd74rcrnuu3	cmtpf9ekh0000hmd7flbz227v	OPEN_ROLES	Open Positions Grid	{"layout": {"paddingY": "md", "alignment": "left", "container": "wide"}, "elements": [{"id": "jobs-heading", "type": "heading", "content": {"text": "Explore Open Opportunities", "level": 2}, "enabled": true, "position": 0, "alignment": "left"}, {"id": "jobs-text", "type": "text", "content": {"text": "Find your next career step across Engineering, Product, and Sales."}, "enabled": true, "position": 1, "alignment": "left"}], "showInNav": true, "cardStyles": {"borderWidth": 0, "borderRadius": 18}, "templateId": "jobs-grid-cards"}	4	t	t	2026-09-06 06:19:45.302	2026-09-06 06:50:58.452	01	t
cmtpf9el2000ahmd7vk2p5db8	cmtpf9ekn0002hmd74rcrnuu3	cmtpf9ekh0000hmd7flbz227v	ABOUT_US	About Us - Image Left	{"layout": {"paddingY": "md", "alignment": "left", "container": "wide"}, "elements": [{"id": "about-img-left-img", "type": "image", "width": "full", "styles": {"border": {"radius": "9999px"}, "shadow": {"preset": "xl"}, "animation": {"type": "zoom-in"}}, "content": {"alt": "Team workshop session", "fit": "cover", "url": "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80"}, "enabled": true, "position": 0}, {"id": "about-img-left-heading", "type": "heading", "width": "half", "content": {"text": "Driven by Purpose, Built for Impact", "level": 2}, "enabled": true, "position": 1}, {"id": "about-img-left-text", "type": "text", "width": "half", "content": {"text": "he is a giid biy"}, "enabled": true, "position": 2}], "showInNav": true, "templateId": "about-image-left"}	1	t	t	2026-09-06 06:19:45.302	2026-09-06 06:30:46.151	01	t
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."User" (id, email, name, "passwordHash", role, "companyId", "createdAt", "updatedAt") FROM stdin;
cmtoise6q0001nqd7sya81vsk	recruiter@acme.com	Sarah Jenkins	$2b$10$l/Zo/TkeWWr1U8iS5pcDVeGlO93l9GRUA39d6oV3wzY13fFQLk6.S	RECRUITER	cmtoise6g0000nqd76184rut3	2026-09-05 15:10:43.922	2026-09-05 15:10:43.922
cmtoise83000bnqd7mcrwrt5c	recruiter@technova.com	David Kim	$2b$10$l/Zo/TkeWWr1U8iS5pcDVeGlO93l9GRUA39d6oV3wzY13fFQLk6.S	RECRUITER	cmtoise80000anqd7c88xiexp	2026-09-05 15:10:43.971	2026-09-05 15:10:43.971
cmtop3u0m000wvqd7fch92dh2	b210662@rgukt.ac.in	Bhavith	$2b$10$Cxf94GggWtQQiGUYCCTi3.yR88uMG8i33yq40FfZejgMLTAMzlSdK	RECRUITER	cmtop3u0j000vvqd7fgj5b20w	2026-09-05 18:07:35.35	2026-09-05 18:07:35.35
cmtpen7j60001b3d7hhmoiho1	chithulurinaveen@gmail.com	Naveen	$2b$10$Ki5EIylhHObEnZmzrC4XF.31anG9S4PaRvd393RECDVX22vKQ04hm	RECRUITER	cmtpen7j10000b3d7rp89ulxp	2026-09-06 06:02:29.73	2026-09-06 06:02:29.73
cmtpf9ekk0001hmd74p892v5q	santhosh@gmail.com	Santhosh	$2b$10$OaeYba.Uwe5lOl3P2U1wYeesWKW78Qg9uw4HcI/1H.JoV1Q2JduFC	RECRUITER	cmtpf9ekh0000hmd7flbz227v	2026-09-06 06:19:45.284	2026-09-06 06:19:45.284
\.


--
-- Name: Application Application_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT "Application_pkey" PRIMARY KEY (id);


--
-- Name: CareersPage CareersPage_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."CareersPage"
    ADD CONSTRAINT "CareersPage_pkey" PRIMARY KEY (id);


--
-- Name: Company Company_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_pkey" PRIMARY KEY (id);


--
-- Name: Department Department_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Department"
    ADD CONSTRAINT "Department_pkey" PRIMARY KEY (id);


--
-- Name: Job Job_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_pkey" PRIMARY KEY (id);


--
-- Name: Location Location_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Location"
    ADD CONSTRAINT "Location_pkey" PRIMARY KEY (id);


--
-- Name: Media Media_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_pkey" PRIMARY KEY (id);


--
-- Name: PageSection PageSection_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."PageSection"
    ADD CONSTRAINT "PageSection_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Application_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Application_companyId_idx" ON public."Application" USING btree ("companyId");


--
-- Name: Application_jobId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Application_jobId_idx" ON public."Application" USING btree ("jobId");


--
-- Name: CareersPage_companyId_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "CareersPage_companyId_key" ON public."CareersPage" USING btree ("companyId");


--
-- Name: Company_slug_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX "Company_slug_idx" ON public."Company" USING btree (slug);


--
-- Name: Company_slug_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "Company_slug_key" ON public."Company" USING btree (slug);


--
-- Name: Department_name_companyId_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "Department_name_companyId_key" ON public."Department" USING btree (name, "companyId");


--
-- Name: Job_companyId_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX "Job_companyId_idx" ON public."Job" USING btree ("companyId");


--
-- Name: Job_companyId_status_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX "Job_companyId_status_idx" ON public."Job" USING btree ("companyId", status);


--
-- Name: Job_employmentType_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX "Job_employmentType_idx" ON public."Job" USING btree ("employmentType");


--
-- Name: Job_locationCity_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX "Job_locationCity_idx" ON public."Job" USING btree ("locationCity");


--
-- Name: Job_slug_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX "Job_slug_idx" ON public."Job" USING btree (slug);


--
-- Name: Job_status_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX "Job_status_idx" ON public."Job" USING btree (status);


--
-- Name: Job_workMode_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX "Job_workMode_idx" ON public."Job" USING btree ("workMode");


--
-- Name: Location_name_companyId_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "Location_name_companyId_key" ON public."Location" USING btree (name, "companyId");


--
-- Name: Media_companyId_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX "Media_companyId_idx" ON public."Media" USING btree ("companyId");


--
-- Name: PageSection_careersPageId_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX "PageSection_careersPageId_idx" ON public."PageSection" USING btree ("careersPageId");


--
-- Name: PageSection_companyId_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX "PageSection_companyId_idx" ON public."PageSection" USING btree ("companyId");


--
-- Name: User_companyId_idx; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX "User_companyId_idx" ON public."User" USING btree ("companyId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Application Application_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Application Application_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Application"
    ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CareersPage CareersPage_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."CareersPage"
    ADD CONSTRAINT "CareersPage_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Department Department_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Department"
    ADD CONSTRAINT "Department_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Job Job_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Job Job_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Department"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Job Job_locationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES public."Location"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Location Location_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Location"
    ADD CONSTRAINT "Location_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Media Media_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PageSection PageSection_careersPageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."PageSection"
    ADD CONSTRAINT "PageSection_careersPageId_fkey" FOREIGN KEY ("careersPageId") REFERENCES public."CareersPage"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PageSection PageSection_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."PageSection"
    ADD CONSTRAINT "PageSection_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict KcYYnwb78BxNI1od2E0iDM5W7wzxvwgTR9igNloZ9gnuCRcJgYJ8lO8va76NnBE

