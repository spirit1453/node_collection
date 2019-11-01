
class MysqlUtil {
  static runSql(connection, sql, paramAry = []) {
      if (Array.isArray(sql)) {
          const ary = sql.map(ele => this.runSql(connection, ele))
          return Promise.all(ary)
      } else {
          return new Promise((resolve, reject) => {
              connection.query(sql, paramAry, (error, result) => {
                  if (error) {
                      reject(error)
                  } else {
                      resolve(result)
                  }
              })
          })
      }
  }

  static async hasRecord(connection, sql, paramAry = []) {
      const sqlResultAry = await MysqlUtil.runSql(connection, sql, paramAry)

      const result = {
          hasRecord:  Boolean(sqlResultAry.length),
          record: sqlResultAry[0],
          sqlResultAry
      }

      return result
  }
}

Object.freeze(MysqlUtil)
module.exports = MysqlUtil
