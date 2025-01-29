import { useNavigate } from 'react-router'
import { Link } from '#/components/base-ui'
import { errorStyles } from './error.css'

interface InternalErrorProps {
  message: string
  details: string
  stack: string | undefined
  statusCode: number
}

export default function InternalError({ message, details, stack, statusCode }: InternalErrorProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <div className={errorStyles.wrapper}>
      <div className={errorStyles.decorativeGradient}>
        <div className={errorStyles.gradientInner}>
          <div className={errorStyles.gradientBg} />
        </div>
      </div>
      <div className={errorStyles.decorativeCode}>
        <h2 className={errorStyles.decorativeText}>{statusCode}</h2>
      </div>
      <div className={errorStyles.content}>
        <div className={errorStyles.container}>
          <p className={errorStyles.errorCode}>{statusCode}</p>
          <h1 className={errorStyles.title}>{message}</h1>
          <p className={errorStyles.description}>{details}</p>
          {stack && (
            <pre className={errorStyles.pre}>
              <code>{stack}</code>
            </pre>
          )}
          <div className={errorStyles.actions}>
            <button type="button" onClick={handleBack} className={errorStyles.primaryButton}>
              Go back
            </button>
            <Link href="/docs/troubleshooting" className={errorStyles.secondaryButton} newTab>
              Troubleshooting Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
