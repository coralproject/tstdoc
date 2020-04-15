import generate from "./generate";
import path from "path";

export enum ROLE {
  COMMENTER = "COMMENTER",
  STAFF = "STAFF",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
}

export interface TestInterfaceWithOptions {
  /**
   * action refers to the specific operation being performed. If `NEW`, this
   * is referring to a new comment being created. If `EDIT`, then this refers to
   * an operation involving an edit operation on an existing Comment.
   */
  action: "NEW" | "EDIT";

  /**
   * comment refers to the actual Comment data for the Comment being
   * created/edited.
   */
  comment: {
    /**
     * body refers to the actual body text of the Comment being created/edited.
     */
    body: string;

    /**
     * parentID is the identifier for the parent comment (if this Comment is a
     * reply, null otherwise).
     */
    parentID: string | null;
  };

  /**
   * author refers to the User that is creating/editing the Comment.
   */
  author: {
    /**
     * id is the identifier for this User.
     */
    id: string;

    /**
     * role refers to the role of this User.
     */
    role: ROLE;
  };

  /**
   * story refers to the Story being commented on.
   */
  story: {
    /**
     * id is the identifier for this Story.
     */
    id: string;

    /**
     * url is the URL for this Story.
     */
    url: string;
  };

  /**
   * site refers to the Site that the story being commented on belongs to.
   */
  site: {
    /**
     * id is the identifier for this Site.
     */
    id: string;
  };

  /**
   * tenantID is the identifer of the Tenant that this Comment is being
   * created/edited on.
   */
  tenantID: string;

  /**
   * tenantDomain is the domain that is associated with this Tenant that this
   * Comment is being created/edited on.
   */
  tenantDomain: string;
}

it("generates the expected form", async () => {
  const documentation = await generate({
    indent: 3,
    fileName: path.join(__dirname, "generate.spec.ts"),
    symbolNames: ["TestInterfaceWithOptions"],
  });

  expect(documentation).toMatchSnapshot();
});
