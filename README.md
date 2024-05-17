# INTIA
Intia Web platform

## Procedure d'installation
### Requirements:
- Python 3.10 ou +
### Installation 
Ouvrir une fenetre du CMD
- git clone "https://github.com/Etape/INTIA.git"
- cd INTIA
- cd API
- python -m venv virtualenv
- virtualenv/Scripts/activate
- pip install -r requirements.txt
- python manage.py makemigrations
- python manage.py migrate
- python manage.py createsuperuser (vous enseignez votre nom d'utilisateur,votre email,votre mot de passe de superuser)
- python manage.py runserver 127.0.0.1:7000
Ouvrir une autre fenetre du CMD dans INTIA
- cd admin
- python -m http.server 8080

Et c'est tout la plateforme est desormais fonctionnelle
