from django.urls import path

from . import views

urlpatterns = [
    path("", views.accueil, name="accueil"),
    path("cours/", views.liste_niveaux, name="cours"),
    path("cours/<str:niveau>/", views.liste_matieres, name="matieres"),
    path("cours/<str:niveau>/<str:matiere>/", views.afficher_cours, name="cours"),
]
