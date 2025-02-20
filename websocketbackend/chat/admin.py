from django.contrib import admin
from .models import *

admin.site.register(ConversationMessage)
admin.site.register(Conversation)
# Register your models here.
admin.site.site_title='ephraim websockets'
admin.site.index_title='ephraim websockets'
admin.site.site_header='ephraim websockets'

