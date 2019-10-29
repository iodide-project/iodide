# The administration panel

Iodide has an administration view under `/admin`, based on the [Django
admin](https://docs.djangoproject.com/en/2.1/ref/contrib/admin/) interface.

To log into this interface, a user must have the `is_staff` permission set. Most operations (including the one currently described here) require `is_superuser`.

An existing super user can grant old users super-user permissions via
the panel. Or, if no super user is currently configured, you can perform this operation manually via a SQL session (`./manage.py dbshell` from the console):

```sql
update base_user set is_superuser='t', is_staff='t' where username=MY_USER_NAME;
```

## Authentication tokens

In some cases one may want to have special users which can create notebooks on behalf of others (e.g. bots). For this task, we
have configured the iodide server to allow for the notebook creation API to be accessed using django-rest-framework's [token authentication](https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication))

To take advantage of this:

1. Go to the server's admin panel (as a user with root permissions, see above) and create a new user with the "can create on behalf of
   others" permission.
2. Create an auth token attached to the user. Note the value of the "key field".
3. You should now be able to create notebooks (i.e. post to the `/api/v1/notebooks/` on behalf of another user by specifying the owner field and setting a special header incorporating the key as [described in the django rest framework documentation](https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication). Here's an example json payload:

```json
{
  "owner": "username_of_user_who_should_own_notebook",
  "title": "My cool notebook",
  "content": "Fake notebook content"
}
```

The server should return a json blob, which should contain an "id" field you can pass back to the user in a form they can use (e.g. `/notebooks/38/`)
