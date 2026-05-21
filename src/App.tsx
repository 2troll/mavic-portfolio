import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Github,
  Globe,
  Lightbulb,
  type LucideIcon,
  Mail,
  Linkedin,
  Rocket,
  Target,
  Wrench,
  Zap,
} from 'lucide-react'
import { Card3D } from './components/Card3D'
import { MagicBorderButton } from './components/MagicBorderButton'
import { HeroTextEffect } from './components/HeroTextEffect'

// ─── Shared animation variants ───────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 20 },
  },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
}

// ─── Shared section heading ───────────────────────────────────────────────────

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="mb-16 text-center"
    >
      <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
        {children}
      </h2>
      <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />
    </motion.div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.9 }}
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-white/[0.04] bg-[#0a0a0f]/80 px-6 py-4 backdrop-blur-xl md:px-12"
    >
      <motion.span
        className="text-xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        Mavic
      </motion.span>

      <ul className="hidden list-none items-center gap-8 md:flex">
        {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
          <motion.li
            key={item}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <a
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-white"
            >
              {item}
            </a>
          </motion.li>
        ))}
      </ul>

      <MagicBorderButton href="#contact" className="hidden py-2.5 text-xs md:flex">
        Hire Me <ArrowRight className="ml-1 h-3 w-3" />
      </MagicBorderButton>
    </motion.nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.18),transparent)]" />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(99,102,241,0.13) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Central blur orb */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-700/5 blur-[130px]" />

      <div className="relative z-10 max-w-4xl space-y-9">
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-medium text-indigo-300"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
          </span>
          Available for new opportunities
        </motion.div>

        {/* Animated heading — word-by-word with 3D spring flip */}
        <HeroTextEffect
          text="Hello, I'm Mavic"
          className="text-6xl font-black leading-none tracking-tight md:text-8xl"
          wordClassName="bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.65 }}
          className="mx-auto max-w-md text-lg leading-relaxed text-slate-400 md:text-xl"
        >
          Visionary Leader{' '}
          <span className="font-semibold text-indigo-400">·</span>{' '}
          Strategic Thinker{' '}
          <span className="font-semibold text-cyan-400">·</span>{' '}
          Problem Solver
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.85 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagicBorderButton href="#projects">
            View My Work <ArrowRight className="ml-1 h-4 w-4" />
          </MagicBorderButton>

          <motion.a
            href="#contact"
            className="text-sm font-semibold text-slate-400 underline underline-offset-4 transition-colors duration-200 hover:text-white"
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1 text-slate-600"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────

const stats = [
  { value: '5+', label: 'Years of Experience' },
  { value: '30+', label: 'Projects Completed' },
  { value: '15+', label: 'Satisfied Clients' },
]

function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#0d0d1a] py-32 px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(99,102,241,0.07),transparent)]" />

      <div className="relative mx-auto max-w-5xl">
        <SectionTitle>About Me</SectionTitle>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid items-center gap-12 md:grid-cols-2"
        >
          <motion.div variants={fadeUp} className="space-y-5">
            <p className="text-lg leading-relaxed text-slate-300">
              I'm a results-driven professional passionate about turning ideas
              into reality. With a focus on{' '}
              <span className="font-semibold text-indigo-400">
                efficiency and innovation
              </span>
              , I bring visions to life through strategic planning and decisive
              action.
            </p>
            <p className="leading-relaxed text-slate-400">
              Whether it's leading teams, managing complex projects, or creating
              impactful solutions, I thrive on challenges that push boundaries
              and demand creative thinking at scale.
            </p>
            <div className="pt-2">
              <MagicBorderButton href="#contact" className="text-sm">
                Let's Collaborate <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </MagicBorderButton>
            </div>
          </motion.div>

          <motion.div variants={stagger} className="flex flex-col gap-4">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="group rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 transition-all duration-300 hover:border-indigo-500/20 hover:bg-white/[0.04]"
              >
                <div className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-slate-500">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Skills ───────────────────────────────────────────────────────────────────

interface Skill {
  icon: LucideIcon
  title: string
  description: string
  gradient: string
  iconClass: string
}

const skills: Skill[] = [
  {
    icon: Target,
    title: 'Leadership',
    description:
      'Leading teams to success with vision and clarity. Building cohesive units that consistently deliver exceptional results.',
    gradient: 'from-indigo-500/20 to-indigo-700/10',
    iconClass: 'bg-indigo-500/15 text-indigo-400',
  },
  {
    icon: Zap,
    title: 'Strategy',
    description:
      'Developing winning strategies for complex challenges. Turning market insights into decisive, high-impact action plans.',
    gradient: 'from-cyan-500/20 to-cyan-700/10',
    iconClass: 'bg-cyan-500/15 text-cyan-400',
  },
  {
    icon: Wrench,
    title: 'Problem Solving',
    description:
      'Finding efficient solutions to the most difficult problems. Engineering clear pathways where others see dead ends.',
    gradient: 'from-purple-500/20 to-purple-700/10',
    iconClass: 'bg-purple-500/15 text-purple-400',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'Bringing fresh ideas and creative approaches to every challenge. Pioneering new methodologies for the modern era.',
    gradient: 'from-amber-500/20 to-amber-700/10',
    iconClass: 'bg-amber-500/15 text-amber-400',
  },
]

function Skills() {
  return (
    <section id="skills" className="py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <SectionTitle>Core Skills</SectionTitle>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {skills.map((skill) => (
            <motion.div key={skill.title} variants={fadeUp}>
              <Card3D>
                {/* Coloured gradient overlay */}
                <div
                  className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${skill.gradient} opacity-70`}
                />
                <div className="relative z-10">
                  <div className={`mb-4 inline-flex rounded-xl p-3 ${skill.iconClass}`}>
                    <skill.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">{skill.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {skill.description}
                  </p>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────

interface Project {
  icon: LucideIcon
  title: string
  description: string
  tags: string[]
  gradient: string
  iconClass: string
}

const projects: Project[] = [
  {
    icon: BarChart3,
    title: 'Business Analytics Dashboard',
    description:
      'A comprehensive analytics platform for real-time business insights and decision making. Integrated ML models for predictive forecasting.',
    tags: ['Strategy', 'Analytics', 'Data'],
    gradient: 'from-indigo-600/25 to-indigo-900/15',
    iconClass: 'bg-indigo-500/20 text-indigo-400',
  },
  {
    icon: Rocket,
    title: 'Product Launch Campaign',
    description:
      'Led a successful product launch that exceeded targets by 150% in Q1. Coordinated a cross-functional team of 20+ members across three time zones.',
    tags: ['Marketing', 'Leadership', 'GTM'],
    gradient: 'from-cyan-600/25 to-cyan-900/15',
    iconClass: 'bg-cyan-500/20 text-cyan-400',
  },
  {
    icon: Globe,
    title: 'Digital Transformation',
    description:
      'Spearheaded company-wide digital transformation improving efficiency by 40%. Redesigned workflows and automated all critical business processes.',
    tags: ['Technology', 'Management', 'Ops'],
    gradient: 'from-purple-600/25 to-purple-900/15',
    iconClass: 'bg-purple-500/20 text-purple-400',
  },
]

function Projects() {
  return (
    <section id="projects" className="bg-[#0d0d1a] py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <SectionTitle>Featured Projects</SectionTitle>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-6 md:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.div key={project.title} variants={fadeUp} className="flex">
              <Card3D className="flex flex-col">
                <div
                  className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${project.gradient} opacity-60`}
                />
                <div className="relative z-10 flex flex-1 flex-col">
                  <div className={`mb-4 inline-flex w-fit rounded-xl p-3 ${project.iconClass}`}>
                    <project.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold leading-snug text-white">
                    {project.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-slate-400">
                    {project.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

interface ContactLink {
  icon: LucideIcon
  label: string
  href: string
  iconClass: string
}

const contactLinks: ContactLink[] = [
  { icon: Mail, label: 'Email Me', href: 'mailto:hello@mavic.dev', iconClass: 'text-indigo-400' },
  { icon: Linkedin, label: 'LinkedIn', href: '#', iconClass: 'text-cyan-400' },
  { icon: Github, label: 'GitHub', href: '#', iconClass: 'text-purple-400' },
]

function Contact() {
  return (
    <section id="contact" className="py-32 px-6">
      <div className="mx-auto max-w-2xl text-center">
        <SectionTitle>Get In Touch</SectionTitle>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 text-lg leading-relaxed text-slate-400"
        >
          Ready to collaborate or want to discuss an opportunity?{' '}
          <span className="font-semibold text-white">Let's connect.</span> I'm
          always open to exciting new challenges.
        </motion.p>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          {contactLinks.map((link) => (
            <motion.div key={link.label} variants={fadeUp}>
              <MagicBorderButton href={link.href}>
                <link.icon className={`h-4 w-4 ${link.iconClass}`} />
                {link.label}
              </MagicBorderButton>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-8 px-6 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-sm text-slate-600"
      >
        © 2026 Mavic. All rights reserved. Built with precision by{' '}
        <span className="text-indigo-400 font-medium">Luigi</span>
      </motion.p>
    </footer>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 antialiased">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
