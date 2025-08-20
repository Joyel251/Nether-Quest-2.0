import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Temporarily disable middleware to resolve import issues
  return NextResponse.next()
}

export const config = {
  matcher: ['/game'],
}