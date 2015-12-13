package tables

import models.Category
import play.api.Play
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfig}
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._
import slick.lifted.Tag
import play.api.libs.json.{JsValue, Writes, Json}

object CategoryTable extends CategoryTable

trait CategoryTable extends HasDatabaseConfig[JdbcProfile]{
  val dbConfig = DatabaseConfigProvider.get[JdbcProfile](Play.current)

  class Categories(tag: Tag) extends Table[Category](tag, "category") {

    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def title = column[String]("title")

    def * = (id, title) <> ((Category.apply _).tupled, Category.unapply)
  }

  val categories = TableQuery[Categories]

  implicit val categoryFormat = Json.format[Category]

  def findAll(sortBy: String, desc: Boolean) = {
    db.run(categories.sortBy(sortField(_, sortBy, desc)).result)
  }

  def findOne(id: Int) = db.run(find(id).result.headOption)

  def update(categoryId: Int, category: Category) = db.run(find(categoryId).update(category.copy(id = categoryId)))

  def create(category: Category) = db.run(categories += category)

  def destroy(id: Int) = db.run(find(id).delete)

  private def find(id: Int) = categories.filter(_.id === id)

  private def sortField(category: Categories, sortBy: String, desc: Boolean) = {
    (sortBy, desc) match {
      case ("title",   false) => category.title.asc
      case ("title",   true)  => category.title.desc
      case ("id",      true)  => category.id.desc
      case _                  => category.id.asc
    }
  }

}