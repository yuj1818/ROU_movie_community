from allauth.account.adapter import DefaultAccountAdapter

class CustomAccountsAdapter(DefaultAccountAdapter):

  def save_user(self, request, user, form, commit=True):
    data = form.cleaned_data
    user = super().save_user(request, user, form, False)
    region = data.get('region')
    birth = data.get('birth')
    if region:
      user.region = region
      user.birth = birth
    user.save()
    return user