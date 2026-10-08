from django_filters import rest_framework as filters

from .models import Job


class JobFilter(filters.FilterSet):
    keyword = filters.CharFilter(field_name="title", lookup_expr="icontains")
    address = filters.CharFilter(field_name="address", lookup_expr="icontains")
    min_salary = filters.NumberFilter(field_name="salary" or 0, lookup_expr="gte")
    max_salary = filters.NumberFilter(
        field_name="salary" or 1000000000, lookup_expr="lte"
)

    class Meta:
        model = Job
        fields = (
            "keyword",
            "address",
            "education",
            "jobtype",
            "industry",
            "experience",
            "min_salary",
            "max_salary",
        )
