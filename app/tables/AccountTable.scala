package tables

import models.{Account, Category}
import play.api.Play
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfig}
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._
import slick.lifted.Tag
import play.api.libs.json.{JsValue, Writes, Json}
import javax.sql.DataSource

object AccountTable extends AccountTable

trait AccountTable extends HasDatabaseConfig[JdbcProfile]{
  val dbConfig = DatabaseConfigProvider.get[JdbcProfile](Play.current)

  class Accounts(tag: Tag) extends Table[Account](tag, "account") {

    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def login = column[String]("login")

    def password = column[String]("password")

    def * = (id, login, password) <> ((Account.apply _).tupled, Account.unapply)
  }

  val accounts = TableQuery[Accounts]

  implicit val accountFormat = Json.format[Account]

  def findAll(sortBy: String, desc: Boolean) = {
    db.run(accounts.sortBy(sortField(_, sortBy, desc)).result)
  }

  def findOne(id: Int) = db.run(find(id).result.headOption)

  def update(accountId: Int, account: Account) = db.run(find(accountId).update(account.copy(id = accountId)))

  def create(account: Account) = db.run(accounts += account)

  def destroy(id: Int) = db.run(find(id).delete)

  def checkAccount(login: String, password: String): Boolean = {
    ///TODO implement method
    true
  }

//  def checkAccount(login: String, password: String): Boolean = db.run(findByLogin(login, password).result.headOption)

  private def findByLogin(login: String, password: String) = accounts.filter(x => (x.password === password && x.login === login))

  private def find(id: Int) = accounts.filter(_.id === id)

  private def sortField(account: Accounts, sortBy: String, desc: Boolean) = {
    (sortBy, desc) match {
      case ("login",   false)    => account.login.asc
      case ("login",   true)     => account.login.desc
      case ("password",   false) => account.password.asc
      case ("password",   true)  => account.password.desc
      case ("id",      true)     => account.id.desc
      case _                     => account.id.asc
    }
  }

}