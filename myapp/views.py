from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

from .models import Matiere, Niveau


def accueil(request: HttpRequest) -> HttpResponse:
    # Page d'accueil avec lien vers 'cours'
    return render(request, "myapp/accueil.html")


def liste_niveaux(request: HttpRequest) -> HttpResponse:
    # Affiche tous les niveaux (6ème à Terminale)
    niveaux = Niveau.objects.all()
    return render(request, "myapp/niveaux.html", {"niveaux": niveaux})


def liste_matieres(request: HttpRequest, niveau: str) -> HttpResponse:
    matieres = Matiere.objects.filter(niveau__nom=niveau)
    return render(
        request, "myapp/matieres.html", {"matieres": matieres, "niveau": niveau}
    )


def afficher_cours(request: HttpRequest, niveau: str, matiere: str) -> HttpResponse:
    # Redirige vers le GitBook ou l'intègre
    cours = Matiere.objects.get(niveau__nom=niveau, nom=matiere)
    return render(request, "myapp/cours.html", {"cours": cours})
