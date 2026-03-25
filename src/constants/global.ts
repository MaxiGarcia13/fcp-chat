import pkg from '../../package.json'

export const APP_VERSION = pkg.version
export const APP_NAME = pkg.name
export const AUTHOR_NAME = pkg.author
export const REPOSITORY_URL = pkg.repository.url.replace('git+', '')
export const LINKEDIN_URL = 'https://www.linkedin.com/in/maximilianogarcia13'
export const BASE_IMAGE_URL = '/favicon.png'
