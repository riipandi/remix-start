import type { HeadersFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Button } from '#/components/base-ui'
import { Link } from '#/components/link'
import type { Site } from '#/types/site'
import { clx } from '#/utils/ui-helper'

export const loader: LoaderFunction = async ({ request }) => {
  let host = request.headers.get('host')
  if (!host) throw new Error('Missing host')

  const domain = process.env.DOMAIN || 'example.com'

  console.debug('Original host:', host)

  // Check if it's a subdomain
  const isSubdomain = host.endsWith(`.${domain}`) && !host.startsWith('www.')

  if (!isSubdomain) {
    console.debug('Not a subdomain, returning default page')
    return json({ isDefault: true, domain })
  }

  // Handle localhost by replacing 'localhost' with the domain name
  if (host.includes('localhost')) {
    host = host.replace(/localhost:\d+/, domain)
    console.debug('Transformed host for localhost:', host)
  }

  // Extract the subdomain (slug) from the host
  if (host.endsWith(`.${domain}`)) {
    host = host.replace(`.${domain}`, '')
    console.debug('Subdomain (slug):', host)
  }

  // Sample list of sites; ideally, this would come from a database
  const sites: Site[] = [
    {
      id: 1,
      name: 'Example 1',
      slug: 'example1',
      description: 'Description for example 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Example 2',
      slug: 'example2',
      description: 'Description for example 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  // Find the current site based on the slug
  const currentSite = sites.find((site) => site.slug === host)

  if (!currentSite) {
    console.debug('Site not found for slug:', host)
    throw new Response(null, { status: 404, statusText: 'Not Found' })
  }

  console.debug('Returning data for site:', currentSite)

  return json({ isDefault: false, domain, sites, currentSite })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data.isDefault) {
    return [{ title: 'Remix Start' }, { name: 'description', content: 'Welcome to Remix Start' }]
  }
  return [
    { title: data.currentSite.name },
    { name: 'description', content: data.currentSite.description },
  ]
}

export const headers: HeadersFunction = () => ({ 'Cache-Control': 'max-age=3600, s-maxage=3600' })

export default function IndexPage() {
  const data = useLoaderData<typeof loader>()

  console.debug('data', data)

  if (!data || data.isDefault) {
    return (
      <div className="mx-auto flex size-full min-h-screen flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <h1 className="block font-bold text-7xl text-gray-800 sm:text-7xl dark:text-white">
          Welcome to Remix
        </h1>
        <div className="mt-8 max-w-2xl text-gray-600 text-lg sm:mt-10 dark:text-gray-300">
          <p className="leading-8">
            Build your own personal to show everything you are and create. Launch your personal site
            in seconds, your content integrated into your personal page.
          </p>
        </div>
        <div className="mt-8 flex flex-row items-center justify-center gap-4 lg:mt-12">
          <Button variant="primary">
            <Link to="/login">Dashboard</Link>
          </Button>
          <Button variant="secondary">
            <Link to="https://github.com/riipandi/remix-start" newTab>
              GitHub Repo
            </Link>
          </Button>
          <Button variant="destructive">
            <Link to="https://remix.run/docs" newTab>
              Remix Docs
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Destructure the data object.
  const { domain, sites, currentSite } = data

  return (
    <div className="mx-auto flex size-full min-h-screen flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
      <h1 className="block font-bold text-7xl text-gray-800 sm:text-7xl dark:text-white">
        Welcome to Remix
      </h1>

      <div className="mt-8 max-w-2xl text-gray-600 text-lg sm:mt-10 dark:text-gray-300">
        <p className="leading-8">{currentSite.description}</p>
      </div>

      <div className="mt-8 flex flex-row items-center justify-center gap-4 lg:mt-12">
        <Button variant="primary">
          <Link to="/login">Dashboard</Link>
        </Button>

        {sites.map(({ slug }: { slug: string }) => (
          <Button
            key={slug}
            variant="secondary"
            className={clx(currentSite.slug === slug ? 'text-primary-500' : 'text-gray-950')}
          >
            <Link
              to={`http${process.env.NODE_ENV === 'production' ? 's' : ''}://${slug}.${
                process.env.NODE_ENV === 'production' ? domain : 'localhost:3000'
              }`}
            >{`${slug}.${domain}`}</Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
