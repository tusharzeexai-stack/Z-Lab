import os
import sys
from pathlib import Path
from django.core.wsgi import get_wsgi_application

# Add current directory to python path
current_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(current_dir))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = get_wsgi_application()
