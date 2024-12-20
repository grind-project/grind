from django.db import models


class Niveau(models.Model):
    nom = models.CharField(max_length=100)  # ex: "6ème", "5ème"...

    def __str__(self) -> str:
        return self.nom


class Matiere(models.Model):
    nom = models.CharField(max_length=100)  # ex: "Mathématiques", "Physique"
    niveau = models.ForeignKey(Niveau, on_delete=models.CASCADE)
    # url_gitbook = models.URLField()  # Pour stocker l'URL du GitBook

    def __str__(self) -> str:
        return f"{self.nom} ({self.niveau.nom})"
