import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const cssPath = path.join(process.cwd(), 'src', 'app', 'globals.css')
    const cssContent = fs.readFileSync(cssPath, 'utf-8')

    const variables: Array<{
      name: string
      lightValue: string
      darkValue: string
    }> = []
    const foundVars = new Set<string>()

    // Extract :root variables (light theme)
    const rootMatch = cssContent.match(/:root\s*{([^}]*)}/)
    if (rootMatch) {
      const rootContent = rootMatch[1]
      const varMatches = rootContent.matchAll(/\s*(--[^:]+):\s*([^;]+);/g)
      for (const match of varMatches) {
        const name = match[1].trim()
        const value = match[2].trim()
        // Skip non-color variables like fonts, radius, shadows, spacing
        if (
          !name.includes('font-') &&
          !name.includes('radius') &&
          !name.includes('shadow-') &&
          !name.includes('tracking-') &&
          !name.includes('spacing')
        ) {
          foundVars.add(name)
          variables.push({
            name,
            lightValue: value,
            darkValue: '',
          })
        }
      }
    }

    // Extract .dark variables (dark theme overrides)
    const darkMatch = cssContent.match(/\.dark\s*{([^}]*)}/)
    if (darkMatch) {
      const darkContent = darkMatch[1]
      const varMatches = darkContent.matchAll(/\s*(--[^:]+):\s*([^;]+);/g)
      for (const match of varMatches) {
        const name = match[1].trim()
        const value = match[2].trim()
        // Skip non-color variables
        if (
          !name.includes('font-') &&
          !name.includes('radius') &&
          !name.includes('shadow-') &&
          !name.includes('tracking-') &&
          !name.includes('spacing')
        ) {
          const existing = variables.find((v) => v.name === name)
          if (existing) {
            existing.darkValue = value
          } else {
            variables.push({
              name,
              lightValue: '',
              darkValue: value,
            })
          }
        }
      }
    }

    // Sort by name
    variables.sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(variables)
  } catch (error) {
    console.error('Error reading CSS variables:', error)
    return NextResponse.json({ error: 'Failed to read CSS variables' }, { status: 500 })
  }
}
