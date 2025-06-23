import { Button } from '@/components/ui/button'

type LoginProps = {
    setView: (view: string) => void
}

function Dashboard({ setView }: LoginProps) {
    return (
        <Button type="register" className="w-full" onClick={() => setView('login')}>
            :D
        </Button>
    )
}

export { Dashboard }