import factory
from django.contrib.auth import get_user_model
from faker import Factory as FakerFactory

faker = FakerFactory.create()


class UserFactory(factory.django.DjangoModelFactory):
    first_name = factory.LazyAttribute(lambda o: faker.first_name())
    last_name = factory.LazyAttribute(lambda o: faker.last_name())
    email = factory.LazyAttribute(lambda o: faker.company_email())
    username = factory.LazyAttribute(lambda o: o.email)

    class Meta:
        model = get_user_model()
