package tables

import models.Post
import play.api.Play
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfig}
import play.api.libs.json.Json
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._
import slick.lifted.Tag

object PostTable extends PostTable

trait PostTable extends HasDatabaseConfig[JdbcProfile]{
  val dbConfig = DatabaseConfigProvider.get[JdbcProfile](Play.current)

  class Posts(tag: Tag) extends Table[Post](tag, "post") {

    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def title = column[String]("title")

    def content = column[String]("content")

    def categoryId = column[Int]("categoryId")
    def category = foreignKey("categoryId", categoryId, CategoryTable.categories)(_.id)

    def * = (id, title, content, categoryId) <> ((Post.apply _).tupled, Post.unapply)
  }

  val posts = TableQuery[Posts]

  implicit val postFormat = Json.format[Post]

  def findAll(sortBy: String, desc: Boolean) = {
    db.run(posts.sortBy(sortField(_, sortBy, desc)).result)
  }

  def findOne(id: Int) = db.run(find(id).result.headOption)

  def update(postId: Int, post: Post) = db.run(find(postId).update(post.copy(id = postId)))

  def create(post: Post) = db.run(posts += post)

  def destroy(id: Int) = db.run(find(id).delete)

  private def find(id: Int) = posts.filter(_.id === id)

  private def sortField(post: Posts, sortBy: String, desc: Boolean) = {
    (sortBy, desc) match {
      case ("title",   false) => post.title.asc
      case ("title",   true)  => post.title.desc
      case ("content",   false) => post.content.asc
      case ("content",   true)  => post.content.desc
      case ("id",      true)  => post.id.desc
      case _                  => post.id.asc
    }
  }

}