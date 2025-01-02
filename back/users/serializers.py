from rest_framework import serializers

from users.models import User


class UserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = "__all__"
        read_only_fields = ["email"]

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            if value != "":
                setattr(instance, field, value)
        instance.save()
        return instance
