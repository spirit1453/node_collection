
class MysqlUtil {
  static runSql(connection, sql) {
      if (Array.isArray(sql)) {
          const ary = sql.map(ele => this.runSql(connection, ele))
          return Promise.all(ary)
      } else {
          return new Promise((resolve, reject) => {
              connection.query(sql, (error, result) => {
                  if (error) {
                      reject(error)
                  } else {
                      resolve(result)
                  }
              })
          })
      }
  }
}

Object.freeze(MysqlUtil)
module.exports = MysqlUtil
