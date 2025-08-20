import { login} from './actions'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <form>
    <label htmlFor="team-number">Team Number:</label>
      <input id="team-number" name="team-number" required />
      <label htmlFor="team-name">Team Name:</label>
      <input id="team-name" name="team-name" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <Link href={'/signup'}>Sign Up here!</Link>
    </form>
  )
}