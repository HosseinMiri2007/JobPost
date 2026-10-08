from rest_framework.views import exception_handler



def custom_exception_handler(exc,context):
    response = exception_handler(exc, context)

    exception_class = exc.__class__.__name__
    print(exception_class)


    # Now add the HTTP status code to the response.
    # if response is not None:
    #     response.data['status_code'] = response.status_code

    if exception_class == "AuthenticationFailed":
        response.data = {
            'error':'username or password is invalid'
        }

    if exception_class == "NotAuthenticated":
        response.data = {
            'error':'login first to use this resource'
        }
    return response