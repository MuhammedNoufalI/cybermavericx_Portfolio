
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // 1. Profile
    const profile = await prisma.profile.create({
        data: {
            fullName: 'Muhammed Noufal',
            headline: 'Cloud Systems Engineer',
            bio: 'Cloud Systems Engineer with strong expertise in Linux infrastructure, cloud platforms (AWS & Azure), containerization, automation, and CI/CD. Proven background in cloud migration, performance tuning, cost optimization, and delivering secure, scalable infrastructure.',
            email: 'muhammednoufal7@gmail.com',
            phone: '+971545975212',
            location: 'Dubai, UAE',
            linkedinUrl: 'https://linkedin.com/in/noufal-muhammed', // Inferred or placeholder
            // website: 'https://muhammednoufal.cybermavericx.com', // Not in schema but good to have note
        },
    })
    console.log('Created Profile:', profile.id)

    // 2. Jobs
    const jobsData = [
        {
            company: 'TIMES WORLD',
            position: 'Infrastructure Engineer',
            startDate: new Date('2024-07-01'),
            description: 'Cloud & Server Migration: Upgraded Azure LBs, migrated Ubuntu servers, 30+ websites. CI/CD & Automation: Azure DevOps, GitLab, Plesk CI/CD. Enterprise Infrastructure: Designed secure on-prem envs, RTA Eco Fleet compliance. Monitoring: Prometheus + Grafana. Cost Optimization: Reduced costs with CloudPanel.io and Digital Ocean/Contabo.',
            location: 'Dubai',
            technologies: 'Azure, Ubuntu, Plesk, Azure DevOps, GitLab, Prometheus, Grafana, CloudPanel.io',
        },
        {
            company: 'HASH CODE IT SOLUTIONS',
            position: 'Cloud System Engineer',
            startDate: new Date('2021-09-01'),
            endDate: new Date('2024-06-30'),
            description: 'Managed Linux servers (AWS, Azure, DO). Built Docker-based Odoo environments. Automated backups. Implemented monitoring stack (Loki/Prom/Grafana). Cost optimization with multi-instance Odoo and Zulip.',
            location: 'Dubai',
            technologies: 'AWS, Azure, Digital Ocean, Odoo, Docker, Bash, Loki, Promtail, Nginx, Certbot',
        },
        {
            company: 'TECHZMATRIX SOFTWARE TECHNOLOGIES Pvt. Ltd',
            position: 'AWS Support Engineer',
            startDate: new Date('2020-02-01'),
            endDate: new Date('2020-07-31'),
            description: 'L1 response for IT inquiries. Server/Network security recommendations. Maintenance of manuals and training.',
            location: 'India', // Inferred
            technologies: 'AWS, IT Support',
        },
        {
            company: 'TELEYSIA NETWORKS Pvt. Ltd',
            position: 'RF Engineer',
            startDate: new Date('2016-09-01'),
            endDate: new Date('2019-12-31'),
            description: 'RF surveys, drive tests, network optimization, UBR/IWAN deployment.',
            location: 'India',
            technologies: 'RF, UBR, IWAN',
        },
        {
            company: 'SYSLINT TECHNOLOGIES INDIA Pvt. Ltd',
            position: 'Junior Support Engineer',
            startDate: new Date('2015-09-01'),
            endDate: new Date('2016-03-31'),
            description: 'Linux server support (RedHat, Ubuntu, Fedora).',
            location: 'India',
            technologies: 'Linux, RedHat, Ubuntu, Fedora',
        }
    ]

    for (const job of jobsData) {
        await prisma.job.create({ data: job })
    }
    console.log('Created Jobs')

    // 3. Certifications
    const certsData = [
        { name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', issueDate: new Date('2020-01-01') }, // Date approximated
        { name: 'Red Hat Certified System Administrator (RHCSA)', issuer: 'Red Hat', issueDate: new Date('2015-01-01') }, // Date approximated
        { name: 'Red Hat Certified Engineer (RHCE)', issuer: 'Red Hat', issueDate: new Date('2015-01-01') },
        { name: 'Huawei Technical Safety Passport', issuer: 'Huawei', issueDate: new Date('2018-01-01') },
    ]

    for (const cert of certsData) {
        await prisma.certification.create({ data: cert })
    }
    console.log('Created Certifications')

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
