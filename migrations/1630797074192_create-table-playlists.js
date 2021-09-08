exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_playlists', 'old_playlists', 'old_playlists', 'old playlists')");
  pgm.sql("UPDATE playlists SET owner = 'old_playlists' WHERE owner = NULL");
  pgm.addConstraint('playlists', 'fk_playlits.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
