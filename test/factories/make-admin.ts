import { faker } from "@faker-js/faker/locale/pt_BR";
import type { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Admin, type AdminProps } from "@/domain/iam/enterprise/entities/admin";

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id
  );

  return admin;
}
