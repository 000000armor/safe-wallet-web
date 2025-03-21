import { getTimeoutErrorMessage, isTimeoutError } from '@/utils/ethers-utils'
import classNames from 'classnames'
import { Box, Typography } from '@mui/material'
import LoadingSpinner, { SpinnerStatus } from '@/components/new-safe/create/steps/StatusStep/LoadingSpinner'
import { PendingStatus } from '@/store/pendingTxsSlice'
import css from './styles.module.css'

const getStep = (status: PendingStatus, error?: Error) => {
  switch (status) {
    case PendingStatus.PROCESSING:
    case PendingStatus.RELAYING:
      return {
        description: 'Transaction is now processing',
        instruction: 'The transaction was confirmed and is now being processed.',
      }
    case PendingStatus.INDEXING:
      return {
        description: 'Transaction was processed',
        instruction: 'It is now being indexed.',
      }
    default:
      return {
        description: error ? 'Transaction failed' : 'Transaction was successful',
        instruction: error ? (isTimeoutError(error) ? getTimeoutErrorMessage(error) : error.message) : '',
      }
  }
}

const StatusMessage = ({ status, error }: { status: PendingStatus; error?: Error }) => {
  const stepInfo = getStep(status, error)

  const isSuccess = status === undefined
  const spinnerStatus = error ? SpinnerStatus.ERROR : isSuccess ? SpinnerStatus.SUCCESS : SpinnerStatus.PROCESSING

  return (
    <>
      <Box paddingX={3} mt={3}>
        <LoadingSpinner status={spinnerStatus} />
        <Typography variant="h6" marginTop={2} fontWeight={700}>
          {stepInfo.description}
        </Typography>
      </Box>
      {stepInfo.instruction && (
        <Box className={classNames(css.instructions, error ? css.errorBg : css.infoBg)}>
          <Typography variant="body2">{stepInfo.instruction}</Typography>
        </Box>
      )}
    </>
  )
}

export default StatusMessage
