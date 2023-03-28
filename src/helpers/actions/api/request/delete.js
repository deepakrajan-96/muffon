import profileStore from '@/stores/profile'
import axios from 'axios'
import {
  anonymousToken
} from '@/helpers/data/env'

export default function (
  {
    url,
    params = {},
    isWithSelfId,
    isWithSelfToken,
    onComplete,
    onSuccess,
    onError,
    isSaveError
  }
) {
  if (this) {
    this.error = null
    this.isError = false
    this.isSuccess = false
    this.isLoading = true
  }

  const profileId = profileStore().id

  const {
    token
  } = profileStore()

  const paramsData = {
    ...params,
    ...(isWithSelfId && {
      profile_id: profileId
    }),
    ...(isWithSelfToken && {
      token: (
        token || anonymousToken
      )
    })
  }

  const handleComplete = () => {
    if (this) {
      this.isLoading = false
    }

    if (onComplete) {
      return onComplete()
    }
  }

  const handleSuccess = (
    response
  ) => {
    if (this) {
      this.isSuccess = true
    }

    if (onSuccess) {
      return onSuccess(
        response
      )
    } else {
      return response
    }
  }

  const handleError = (
    error
  ) => {
    if (this) {
      this.isError = true

      if (isSaveError) {
        this.error = error
      }
    }

    if (onError) {
      return onError(
        error
      )
    } else {
      throw error
    }
  }

  return axios.delete(
    url,
    {
      params: paramsData
    }
  ).finally(
    handleComplete
  ).then(
    handleSuccess
  ).catch(
    handleError
  )
}
