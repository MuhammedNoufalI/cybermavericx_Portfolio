import { prisma } from '@/lib/prisma'
import type { Job, Project, Skill, Education, Certification, Award, Testimonial, CustomSection, Profile } from '@prisma/client'

// Single source of truth for what the public portfolio shows.
// The site, the navbar and the admin preview all go through getPortfolio(),
// so a section is visible in one place only if it is visible everywhere.

export const SECTION_DEFS = [
    { key: 'about', label: 'About' },
    { key: 'experience', label: 'Experience' },
    { key: 'projects', label: 'Projects' },
    { key: 'skills', label: 'Skills' },
    { key: 'education', label: 'Education' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'awards', label: 'Awards' },
    { key: 'testimonials', label: 'Testimonials' },
    { key: 'custom', label: 'Custom Sections' },
    { key: 'blog', label: 'Blog' },
] as const

export type SectionKey = typeof SECTION_DEFS[number]['key']

export type SectionStatus = {
    key: SectionKey
    label: string
    published: boolean
    count: number
    order: number
    visible: boolean
    reason: 'visible' | 'empty' | 'disabled'
}

export type NavLink = { href: string; label: string; external?: boolean }

const hasText = (s?: string | null) => !!s && s.trim().length > 0

export async function getPortfolio() {
    const [profile, settings, jobs, projects, skills, education, certifications, awards, testimonials, customSections, blogCount, externalPages] = await Promise.all([
        prisma.profile.findFirst(),
        prisma.sectionSetting.findMany(),
        prisma.job.findMany({ orderBy: { startDate: 'desc' } }),
        prisma.project.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] }),
        prisma.skill.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }] }),
        prisma.education.findMany({ orderBy: [{ order: 'asc' }, { startDate: 'desc' }] }),
        prisma.certification.findMany({ orderBy: { issueDate: 'desc' } }),
        prisma.award.findMany({ orderBy: [{ order: 'asc' }, { date: 'desc' }] }),
        prisma.testimonial.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] }),
        prisma.customSection.findMany({ where: { published: true }, orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] }),
        prisma.blog.count({ where: { published: true } }),
        prisma.externalPage.findMany({ orderBy: { order: 'asc' } }),
    ])

    const visibleCustom = customSections.filter(c => hasText(c.title) && hasText(c.content))

    const counts: Record<SectionKey, number> = {
        about: hasText(profile?.bio) ? 1 : 0,
        experience: jobs.length,
        projects: projects.length,
        skills: skills.filter(s => hasText(s.name)).length,
        education: education.length,
        certifications: certifications.length,
        awards: awards.length,
        testimonials: testimonials.filter(t => hasText(t.quote)).length,
        custom: visibleCustom.length,
        blog: blogCount,
    }

    const settingByKey = new Map(settings.map(s => [s.key, s]))
    const sections: SectionStatus[] = SECTION_DEFS.map((def, i) => {
        const setting = settingByKey.get(def.key)
        const published = setting ? setting.published : true
        const count = counts[def.key]
        const reason: SectionStatus['reason'] = !published ? 'disabled' : count === 0 ? 'empty' : 'visible'
        return { key: def.key, label: def.label, published, count, order: setting?.order ?? i, visible: reason === 'visible', reason }
    }).sort((a, b) => a.order - b.order)

    const isVisible = (key: SectionKey) => sections.find(s => s.key === key)!.visible

    // Nav is derived from visible sections only — no link ever points at a missing section.
    const nav: NavLink[] = [{ href: '/', label: 'Home' }]
    for (const s of sections) {
        if (!s.visible) continue
        if (s.key === 'blog') nav.push({ href: '/blog', label: 'Blog' })
        else if (s.key === 'custom') visibleCustom.forEach(c => nav.push({ href: `/#custom-${c.id}`, label: c.title }))
        else nav.push({ href: `/#${s.key}`, label: s.label })
    }
    externalPages.filter(p => hasText(p.title) && hasText(p.url)).forEach(p => nav.push({ href: p.url, label: p.title, external: true }))
    nav.push({ href: '/contact', label: 'Contact' })

    return {
        profile,
        sections,
        isVisible,
        nav,
        content: {
            jobs: jobs as Job[],
            projects: projects as Project[],
            skills: skills.filter(s => hasText(s.name)) as Skill[],
            education: education as Education[],
            certifications: certifications as Certification[],
            awards: awards as Award[],
            testimonials: testimonials.filter(t => hasText(t.quote)) as Testimonial[],
            custom: visibleCustom as CustomSection[],
        },
    }
}

export type Portfolio = Awaited<ReturnType<typeof getPortfolio>>
export type { Profile }
