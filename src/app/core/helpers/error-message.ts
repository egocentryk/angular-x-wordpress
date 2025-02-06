import { HttpErrorResponse } from '@angular/common/http'

export function setErrorMessage(
  err: HttpErrorResponse,
  dataName?: string
): string {
  let errorMessage = ''
  let name = dataName ?? ''

  if (err) {
    if (err.error instanceof ErrorEvent) {
      // client-side | network error occurred
      errorMessage = `An error occurred: ${err.error.message}`
    } else {
      // backend returned an unsuccessful response code
      const status = err.status

      if (status === 401)
        errorMessage = `You are not authorized to access ${name} data.`
      if (status === 404)
        errorMessage = `${name} data not found. Please try again later.`
      if (status > 500 && status < 600)
        errorMessage = `Server error occurred. Please try again later.`
    }
  }

  return errorMessage
}
