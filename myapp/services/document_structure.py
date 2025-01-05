from myapp.models import Document


def create_grade_structure() -> None:
    # Create grade levels
    grades = ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Term"]
    for order, grade in enumerate(grades):
        grade_doc = Document.objects.create(
            title=grade, content="", order=order, parent=None
        )

        # Create subjects for each grade
        subjects = ["Mathématiques", "Physique", "Chimie", "SVT", "Technologie"]
        for subj_order, subject in enumerate(subjects):
            subject_doc = Document.objects.create(
                title=subject, content="", order=subj_order, parent=grade_doc
            )

            # Create categories for each subject
            categories = ["Cours", "Exemples", "Exercices"]
            for cat_order, category in enumerate(categories):
                Document.objects.create(
                    title=category, content="", order=cat_order, parent=subject_doc
                )
