// Config for the generic CMS editor used by the newer sections.
// Each collection maps to a Prisma model; fields drive both the form and the parser.

export type FieldType = 'text' | 'textarea' | 'markdown' | 'url' | 'date' | 'number' | 'image' | 'checkbox'

export type Field = {
    name: string
    label: string
    type: FieldType
    required?: boolean
    placeholder?: string
    help?: string
}

export type Collection = {
    slug: string
    model: 'project' | 'education' | 'award' | 'testimonial' | 'skill' | 'customSection'
    section: string // SectionSetting key this collection feeds
    title: string
    singular: string
    listColumns: string[]
    orderBy: Record<string, 'asc' | 'desc'>[]
    fields: Field[]
}

export const COLLECTIONS: Collection[] = [
    {
        slug: 'projects', model: 'project', section: 'projects', title: 'Projects', singular: 'Project',
        listColumns: ['title', 'technologies'],
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        fields: [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: true },
            { name: 'technologies', label: 'Technologies (comma separated)', type: 'text', placeholder: 'Terraform, AWS, GitHub Actions' },
            { name: 'demoUrl', label: 'Live / Demo URL', type: 'url' },
            { name: 'repoUrl', label: 'Repository URL', type: 'url' },
            { name: 'imageUrl', label: 'Image', type: 'image' },
            { name: 'order', label: 'Sort order', type: 'number', help: 'Lower numbers show first' },
        ],
    },
    {
        slug: 'skills', model: 'skill', section: 'skills', title: 'Skills', singular: 'Skill',
        listColumns: ['name', 'category'],
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
        fields: [
            { name: 'name', label: 'Skill', type: 'text', required: true, placeholder: 'Kubernetes' },
            { name: 'category', label: 'Category', type: 'text', placeholder: 'Cloud, DevOps, Security...', help: 'Skills with the same category are grouped' },
            { name: 'order', label: 'Sort order', type: 'number' },
        ],
    },
    {
        slug: 'education', model: 'education', section: 'education', title: 'Education', singular: 'Education entry',
        listColumns: ['degree', 'institution'],
        orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
        fields: [
            { name: 'institution', label: 'Institution', type: 'text', required: true },
            { name: 'degree', label: 'Degree / Qualification', type: 'text', required: true },
            { name: 'field', label: 'Field of study', type: 'text' },
            { name: 'location', label: 'Location', type: 'text' },
            { name: 'startDate', label: 'Start date', type: 'date' },
            { name: 'endDate', label: 'End date (empty = Present)', type: 'date' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'order', label: 'Sort order', type: 'number' },
        ],
    },
    {
        slug: 'awards', model: 'award', section: 'awards', title: 'Awards', singular: 'Award',
        listColumns: ['title', 'issuer'],
        orderBy: [{ order: 'asc' }, { date: 'desc' }],
        fields: [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'issuer', label: 'Issuer', type: 'text' },
            { name: 'date', label: 'Date', type: 'date' },
            { name: 'url', label: 'Link', type: 'url' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'order', label: 'Sort order', type: 'number' },
        ],
    },
    {
        slug: 'testimonials', model: 'testimonial', section: 'testimonials', title: 'Testimonials', singular: 'Testimonial',
        listColumns: ['name', 'company'],
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        fields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'role', label: 'Role', type: 'text' },
            { name: 'company', label: 'Company', type: 'text' },
            { name: 'quote', label: 'Quote', type: 'textarea', required: true },
            { name: 'imageUrl', label: 'Photo', type: 'image' },
            { name: 'order', label: 'Sort order', type: 'number' },
        ],
    },
    {
        slug: 'custom', model: 'customSection', section: 'custom', title: 'Custom Sections', singular: 'Custom Section',
        listColumns: ['title', 'published'],
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        fields: [
            { name: 'title', label: 'Section title', type: 'text', required: true, help: 'Also used as the menu label' },
            { name: 'content', label: 'Content (Markdown)', type: 'markdown', required: true },
            { name: 'published', label: 'Published', type: 'checkbox', help: 'Unchecked = hidden from the site' },
            { name: 'order', label: 'Sort order', type: 'number' },
        ],
    },
]

export function getCollection(slug: string) {
    return COLLECTIONS.find(c => c.slug === slug)
}
