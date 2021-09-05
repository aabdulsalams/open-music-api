const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
  name,
  owner,
  username,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
  name,
  owner,
  username,
});

module.exports = { mapDBToModel };
